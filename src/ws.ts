import { EventEmitter } from 'events';
import ReconnectingWebSocket, {
  Options as ReconnectingWebSocketOptions,
} from 'reconnecting-websocket';
import { WebSocket } from './utils';

export interface IWebSocketEvent {
  /**
   * Websocket 打开
   */
  open: (event: Event) => void;
  /**
   * Websocket 关闭
   */
  close: (event: CloseEvent) => void;
  /**
   * Websocket 错误
   */
  error: (error: ErrorEvent) => void;
}

export class WsEventBase<T> {
  emitter = new EventEmitter();
  ws: ReconnectingWebSocket | null = null;
  rwsOptions: ReconnectingWebSocketOptions = {
    minReconnectionDelay: 10000,
    maxReconnectionDelay: 600000,
    reconnectionDelayGrowFactor: 1.3,
    maxRetries: 100,
    connectionTimeout: 10000,
  };
  constructor() {}

  /**
   * 重连通知频道
   * @returns Websocket 连接对象
   */
  reconnect() {
    if (!this.ws) return this.connect();
    return new Promise((resolve) => {
      if (!this.ws || this.ws.readyState === WebSocket.CONNECTING) return;
      this.ws.reconnect();
      this.ws.onopen = (e) => {
        resolve(this.ws!);
      };
    });
  }

  /**
   * 连接 WebSocket 频道
   * @returns Websocket 连接对象
   */
  connect(reload = false): Promise<ReconnectingWebSocket> {
    return new Promise(async (resolve, reject) => {
      if (this.ws && !reload) return resolve(this.ws);
      if (this.ws) this.ws.close();
      return reject(new Error('请在子类中实现 connect 方法'));
    });
  }

  /**
   * WebSocket 监听
   * @param event WebSocket 事件
   * @param listener 监听器
   */
  on<K extends keyof T>(event: K, listener: T[K]) {
    if (this.ws == null || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
    }
    return this.emitter.on(event as string, listener as (...args: any[]) => void);
  }

  /**
   * 移除 WebSocket 监听
   * @param event WebSocket 事件
   * @param listener 监听器
   */
  off<K extends keyof T>(event?: K, listener?: T[K]) {
    if (!event) return this.emitter.removeAllListeners();
    if (!listener) return this.emitter.removeAllListeners(event as string);
    return this.emitter.off(event as string, listener as (...args: any[]) => void);
  }

  /**
   *  WebSocket 单次监听
   * @param event WebSocket 事件
   * @param listener 监听器
   */
  once<K extends keyof T>(event: K, listener: T[K]) {
    return this.emitter.once(event as string, listener as (...args: any[]) => void);
  }

  /**
   * 清除 WebSocket 监听
   */
  clearListener(event?: keyof T) {
    this.emitter.removeAllListeners(event as string);
  }

  /**
   * 移除 WebSocket 消息监听函数
   * @param event  WebSocket 事件
   * @param listener 监听器
   */
  removeListener<K extends keyof T>(event: K, listener: T[K]) {
    return this.off(event, listener);
  }

  /**
   * 添加 WebSocket 消息监听函数
   * @param event  WebSocket 事件
   * @param listener 监听器
   */
  addListener<K extends keyof T>(event: K, listener: T[K]) {
    return this.on(event, listener);
  }
}
