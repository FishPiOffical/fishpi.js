import ReconnectingWebSocket from 'reconnecting-websocket';
import { request, domain, WebSocket } from './utils';
import { EventEmitter } from 'events';
import { IChatData, IChatNotice, IChatQuery } from '.';

interface ChatEvents {
  /**
   * 私聊消息
   * @param msg 私聊消息内容
   */
  data: (msg: IChatData) => void;
  /**
   * 私聊通知消息
   * @param msg 私聊通知
   */
  notice: (msg: IChatNotice) => void;
  /**
   * 撤回消息
   * @param oId 消息 ID
   */
  revoke: (oId: string) => void;
  /**
   * 聊天 Websocket 关闭
   */
  close: (event: CloseEvent) => void;
  /**
   * 聊天 Websocket 错误
   */
  error: (error: ErrorEvent) => void;
}

class ChatChannel {
  private ws: ReconnectingWebSocket | null = null;
  private apiKey: string = '';
  private emitter = new EventEmitter();
  private user = '';

  constructor(user: string, apiKey: string) {
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

  reconnect() {
    if (!this.ws) return this.connect();
    return new Promise((resolve) => {
      if (!this.ws) return;
      this.ws.reconnect();
      this.ws.onopen = (e) => {
        resolve(this.ws!);
      };
    });
  }

  /**
   * 连接用户私聊频道
   * @returns Websocket 连接对象
   */
  connect(reload = false): Promise<ReconnectingWebSocket> {
    return new Promise(async (resolve, reject) => {
      if (this.ws && !reload) return resolve(this.ws);
      if (this.ws) this.ws.close();
      this.ws = new ReconnectingWebSocket(
        this.user
          ? `wss://${domain}/chat-channel?apiKey=${this.apiKey}&toUser=${this.user}`
          : `wss://${domain}/user-channel?apiKey=${this.apiKey}`,
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
        const msg = JSON.parse(e.data);
        let type = 'data';
        let data = msg;
        if (['chatUnreadCountRefresh', 'newIdleChatMessage'].includes(msg.command ?? '')) {
          type = 'notice';
        }
        if (msg.type == 'revoke') {
          type = 'revoke';
          data = msg.data;
        }
        if (type != 'notice' && msg.command != null) return;
        this.emitter.emit(type, data);
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
   * 聊天室监听
   * @param event 聊天室事件
   * @param listener 监听器
   */
  on<K extends keyof ChatEvents>(event: K, listener: ChatEvents[K]) {
    if (this.ws == null) {
      this.connect();
    }
    return this.emitter.on(event, listener);
  }

  /**
   * 移除聊天室监听
   * @param event 聊天室事件
   * @param listener 监听器
   */
  off<K extends keyof ChatEvents>(event: K, listener: ChatEvents[K]) {
    return this.emitter.off(event, listener);
  }

  /**
   * 聊天室单次监听
   * @param event 聊天室事件
   * @param listener 监听器
   */
  once<K extends keyof ChatEvents>(event: K, listener: ChatEvents[K]) {
    return this.emitter.once(event, listener);
  }

  /**
   * 清除聊天室监听
   */
  clearListener() {
    this.emitter.removeAllListeners();
  }

  /**
   * 移除聊天室消息监听函数
   * @param event 聊天室事件
   * @param listener 监听器
   */
  removeListener<K extends keyof ChatEvents>(event: K, listener: ChatEvents[K]) {
    return this.off(event, listener);
  }

  /**
   * 添加聊天室消息监听函数
   * @param event 聊天室事件
   * @param listener 监听器
   */
  addListener<K extends keyof ChatEvents>(event: K, listener: ChatEvents[K]) {
    return this.on(event, listener);
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

      return rsp;
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

  channel(user = '') {
    if (!this.chats[user]) this.chats[user] = new ChatChannel(user, this.apiKey);
    return this.chats[user];
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
   * 获取有私聊用户列表第一条消息
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
