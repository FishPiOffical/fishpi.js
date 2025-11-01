import ReconnectingWebSocket from 'reconnecting-websocket';
import { request, domain, WebSocket } from './utils';
import { IChatData, IChatQuery } from '.';
import { IWebSocketEvent, WsEventBase } from './ws';

interface IChatEvents extends IWebSocketEvent {
  /**
   * 私聊消息
   * @param msg 私聊消息内容
   */
  data: (msg: IChatData) => void;
  /**
   * 撤回消息
   * @param oId 消息 ID
   */
  revoke: (oId: string) => void;
}

class ChatChannel extends WsEventBase<IChatEvents> {
  private apiKey: string = '';
  private user = '';

  constructor(user: string, apiKey: string) {
    super();
    this.apiKey = apiKey;
    this.user = user;
  }

  /**
   * 重新设置请求 Token
   * @param apiKey 接口 API Key
   */
  setToken(apiKey: string) {
    this.apiKey = apiKey;
    this.connect(true);
  }

  /**
   * 连接用户私聊频道
   * @returns Websocket 连接对象
   */
  connect(reload = false): Promise<ReconnectingWebSocket> {
    return new Promise(async (resolve, reject) => {
      if (this.ws && !reload) return resolve(this.ws);
      if (this.ws) this.ws.close();
      if (!this.user) return reject(new Error('请先设置私聊用户名'));
      if (!this.apiKey) return reject(new Error('请先设置 API Key'));
      this.ws = new ReconnectingWebSocket(
        `wss://${domain}/chat-channel?apiKey=${this.apiKey}&toUser=${this.user}`,
        [],
        {
          WebSocket,
          connectionTimeout: 10000,
        },
      );
      this.ws.onopen = (e) => {
        resolve(this.ws!);
      };
      this.ws.onmessage = async (e) => {
        let msg = JSON.parse(e.data);
        let type = 'data';
        if (msg.type == 'revoke') {
          type = 'revoke';
          msg = msg.data;
        }
        this.emitter.emit(type, msg);
      };
      this.ws.onerror = (e) => {
        this.emitter.emit('error', e);
      };
      this.ws.onclose = (e) => {
        this.emitter.emit('close', e);
      };
    });
  }

  async send(msg: string) {
    if (this.ws == null) {
      await this.connect();
    }
    if (this.user) this.ws?.send(msg);
  }

  close() {
    this.ws?.close();
  }

  /**
   * 获取用户私聊历史消息
   * @param param 消息参数
   * @returns 私聊消息列表
   */
  async get({ page = 1, size = 20, autoRead = true }: IChatQuery): Promise<IChatData[]> {
    if (!this.user) return [];
    try {
      let rsp = await request({
        url: `chat/get-message?apiKey=${this.apiKey}&toUser=${this.user}&page=${page}&pageSize=${size}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      if (autoRead) this.markRead();

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 标记用户消息已读
   * @param user 用户名
   * @returns 执行结果
   */
  async markRead(): Promise<void> {
    if (!this.user) return;
    try {
      let rsp = await request({
        url: `chat/mark-as-read?apiKey=${this.apiKey}&fromUser=${this.user}`,
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }
}

export class Chat {
  private apiKey: string = '';
  private chats: { [key: string]: ChatChannel } = {};

  constructor(token: string = '') {
    if (!token) {
      return;
    }
    this.apiKey = token;
  }

  /**
   * 获取私聊频道
   * @param user 私聊用户名
   * @returns 私聊频道
   */
  channel(user: string) {
    if (!this.chats[user]) this.chats[user] = new ChatChannel(user, this.apiKey);
    return this.chats[user];
  }

  /**
   * 关闭私聊频道
   * @param user 私聊用户名
   */
  close(user: string = '') {
    if (user) {
      this.chats[user]?.close();
      delete this.chats[user];
      return;
    }
    Object.values(this.chats).forEach((c) => c.close());
    this.chats = {};
  }

  /**
   * 重新设置请求 Token
   * @param apiKey 接口 API Key
   */
  setToken(apiKey: string) {
    this.apiKey = apiKey;
    Object.values(this.chats).forEach((c) => c.setToken(apiKey));
  }

  /**
   * 获取有私聊用户列表以及第一条消息
   * @returns 私聊消息列表
   */
  async list(): Promise<IChatData[]> {
    try {
      let rsp = await request({
        url: `chat/get-list?apiKey=${this.apiKey}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取未读消息
   * @returns 未读消息列表
   */
  async unread(): Promise<IChatData> {
    try {
      let rsp = await request({
        url: `chat/has-unread?apiKey=${this.apiKey}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 撤回私聊消息
   * @param msgId 消息 ID
   */
  async revoke(msgId: string): Promise<number> {
    try {
      let rsp = await request({
        url: `chat/revoke?apiKey=${this.apiKey}&oId=${msgId}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.result;
    } catch (e) {
      throw e;
    }
  }
}
