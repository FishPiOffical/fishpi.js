import ReconnectingWebSocket from 'reconnecting-websocket';
import {
  INoticeBreezemoon,
  INoticeCount,
  INoticeIdleChat,
  INoticeUnReadCount,
  INoticeWarnBroadcast,
  NoticeList,
  NoticeType,
} from './';
import { domain, request, WebSocket } from './utils';
import EventEmitter from 'events';

interface INoticeEvents {
  bzUpdate: (data: INoticeBreezemoon) => void;
  refreshNotification: (data: INoticeUnReadCount) => void;
  chatUnreadCountRefresh: (data: INoticeUnReadCount) => void;
  newIdleChatMessage: (data: INoticeIdleChat) => void;
  warnBroadcast: (data: INoticeWarnBroadcast) => void;
}

export class Notice {
  private apiKey: string = '';
  private ws: ReconnectingWebSocket | null = null;
  private emitter = new EventEmitter();

  constructor(token: string = '') {
    if (!token) {
      return;
    }
    this.apiKey = token;
  }

  /**
   * 重新设置请求 Token
   * @param apiKey 接口 API Key
   */
  setToken(token: string) {
    this.apiKey = token;
  }

  /**
   * 获取未读消息数
   */
  async count(): Promise<INoticeCount> {
    let rsp;
    try {
      rsp = await request({
        url: `notifications/unread/count?apiKey=${this.apiKey}`,
      });

      if (rsp.code !== 0) throw new Error(rsp.msg);

      if (rsp.userNotifyStatus) rsp.userNotifyStatus = rsp.userNotifyStatus != 0;
      return rsp;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取消息列表
   * @param type 消息类型
   */
  async list(type: NoticeType): Promise<NoticeList> {
    let rsp;
    try {
      rsp = await request({
        url: `api/getNotifications?apiKey=${this.apiKey}&type=${type}`,
      });

      if (rsp.code !== 0) throw new Error(rsp.msg);

      rsp.data.forEach((n: any) => {
        if (!n.description && n.content) n.description = n.content;
        return n;
      });

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 已读指定类型消息
   * @param type 消息类型
   */
  async makeRead(type: NoticeType): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `notifications/make-read/${type}?apiKey=${this.apiKey}`,
      });

      if (rsp.code !== 0) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 已读所有消息
   */
  async readAll(): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `notifications/all-read?apiKey=${this.apiKey}`,
      });

      if (rsp.code !== 0) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 重连通知频道
   * @returns Websocket 连接对象
   */
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
      if (!this.apiKey) return reject(new Error('请先设置 API Key'));
      this.ws = new ReconnectingWebSocket(
        `wss://${domain}/user-channel?apiKey=${this.apiKey}`,
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
        if (msg.command == 'bz-update') {
          msg = { ...msg.bz, command: 'bzUpdate' };
        }
        if (msg.command) {
          this.emitter.emit(msg.command, msg);
        }
      };
      this.ws.onerror = (e) => {
        this.emitter.emit('error', e);
      };
      this.ws.onclose = (e) => {
        this.emitter.emit('close', e);
      };
    });
  }

  /**
   * 聊天室监听
   * @param event 聊天室事件
   * @param listener 监听器
   */
  on<K extends keyof INoticeEvents>(event: K, listener: INoticeEvents[K]) {
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
  off<K extends keyof INoticeEvents>(event: K, listener: INoticeEvents[K]) {
    return this.emitter.off(event, listener);
  }

  /**
   * 聊天室单次监听
   * @param event 聊天室事件
   * @param listener 监听器
   */
  once<K extends keyof INoticeEvents>(event: K, listener: INoticeEvents[K]) {
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
  removeListener<K extends keyof INoticeEvents>(event: K, listener: INoticeEvents[K]) {
    return this.off(event, listener);
  }

  /**
   * 添加聊天室消息监听函数
   * @param event 聊天室事件
   * @param listener 监听器
   */
  addListener<K extends keyof INoticeEvents>(event: K, listener: INoticeEvents[K]) {
    return this.on(event, listener);
  }
}
