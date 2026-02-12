import ReconnectingWebSocket from 'reconnecting-websocket';
import { request, domain, toMetal, clientToVia, WebSocket } from './utils';
import {
  ChatContentType,
  ChatMessageType,
  GestureType,
  Redpacket,
  ClientType,
  IOnlineInfo,
  DiscussMsg,
  RevokeMsg,
  IBarragerMsg,
  IChatRoomMsg,
  IRedPacketInfo,
  IMusicMessage,
  IWeatherMessage,
  IRedPacketStatusMsg,
  CustomMsg,
  IChatRoomMessage,
  IMuteItem,
  IChatRoomNodeInfo,
  IRedpacket,
} from './';
import { IWebSocketEvent, WsEventBase } from './ws';

interface IChatRoomEvents extends IWebSocketEvent {
  /**
   * 在线用户变更
   * @param onlines 在线用户
   */
  online: (onlines: IOnlineInfo[]) => void;
  /**
   * 话题变更
   * @param discuss 话题
   */
  discuss: (discuss: DiscussMsg) => void;
  /**
   * 撤回消息
   * @param oId 被撤回消息 oId
   */
  revoke: (oId: RevokeMsg) => void;
  /**
   * 弹幕消息
   * @param barrage 弹幕消息内容
   */
  barrager: (barrage: IBarragerMsg) => void;
  /**
   * 聊天消息
   * @param msg 聊天消息内容
   */
  msg: (msg: IChatRoomMsg) => void;
  /**
   * 红包消息
   * @param redpacket 红包内容
   */
  redPacket: (redpacket: IChatRoomMsg<IRedpacket>) => void;
  /**
   * 音乐消息
   * @param music 音乐消息内容
   */
  music: (music: IChatRoomMsg<IMusicMessage>) => void;
  /**
   * 天气消息
   * @param weather 天气消息内容
   */
  weather: (weather: IChatRoomMsg<IWeatherMessage>) => void;
  /**
   * 红包领取
   * @param status 红包领取状态
   */
  redPacketStatus: (status: IRedPacketStatusMsg) => void;
  /**
   * 进出通知
   * @param msg 进出通知内容
   */
  custom: (msg: CustomMsg) => void;
  /**
   * 发送所有消息
   * @param type 消息类型
   * @param data 消息内容
   */
  all: (type: string, data: any) => void;
}

export class ChatRoom extends WsEventBase<IChatRoomEvents> {
  private apiKey: string = '';
  private _discusse: string = '';
  private _onlines: IOnlineInfo[] = [];
  private wsTimer: NodeJS.Timeout | null = null;
  private client: ClientType | string = ClientType.Other;
  private version: string = 'Latest';

  constructor(token: string = '') {
    super();
    if (!token) {
      return;
    }
    this.apiKey = token;
  }

  /**
   * 当前在线人数列表，需要先调用 addListener 添加聊天室消息监听
   */
  get onlines() {
    return this._onlines;
  }

  /**
   * 当前聊天室话题，需要先调用 addListener 添加聊天室消息监听
   */
  get discusse() {
    return this._discusse;
  }

  /**
   * 設置当前聊天室话题
   */
  set discusse(val) {
    this.send(`[setdiscuss]${val}[/setdiscuss]`).catch(() => {});
  }

  /**
   * 重新设置请求 Token
   * @param apiKey 接口 API Key
   */
  setToken(apiKey: string) {
    this.apiKey = apiKey;
    this.redpacket.setToken(apiKey);
  }

  /**
   * 设置当前来源类型
   * @param client 来源类型
   * @param version 版本号
   */
  setVia(client: ClientType | string, version: string) {
    this.client = client;
    this.version = version;
  }

  /**
   * 查询聊天室历史消息
   * @param page 消息页码
   * @param type 消息内容类型，HTML 或 Raw，默认 HTML
   */
  async history(page = 1, type = ChatContentType.HTML): Promise<IChatRoomMessage[]> {
    try {
      let rsp = await request({
        url: `chat-room/more?page=${page}&type=${type}&apiKey=${this.apiKey}`,
      });

      if (rsp.code != 0) {
        throw new Error(rsp.msg);
      }

      if (!rsp.data) return rsp;
      (rsp.data as Array<any>).forEach((d, i, data) => {
        try {
          data[i].type = 'msg';
          data[i].md = data[i].content;
          data[i].via = clientToVia(data[i].client);
          data[i].sysMetal = toMetal(data[i].sysMetal);
          data[i].content = JSON.parse(d.content);
          if (data[i].content.recivers)
            data[i].content.recivers = JSON.parse(data[i].content.recivers);
          data[i].type = data[i].content.msgType;
        } catch (e) {}
      });

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取指定消息附近的聊天室消息
   * @param oId 消息 Id
   * @param mode 获取模式，context 上下文模式，after 之后模式
   * @param size 获取消息数量，默认 25，最大 100
   * @param type 获取消息类型，默认 HTML
   */
  async get({
    oId,
    mode = ChatMessageType.Context,
    size = 25,
    type = ChatContentType.HTML,
  }: {
    oId: string;
    mode?: ChatMessageType;
    size?: number;
    type?: ChatContentType;
  }): Promise<IChatRoomMessage[]> {
    try {
      let rsp = await request({
        url: `chat-room/getMessage?oId=${oId}&mode=${mode}&size=${size}&type=${type}&apiKey=${this.apiKey}`,
      });

      if (rsp.code != 0) {
        throw new Error(rsp.msg);
      }

      if (!rsp.data) return rsp;
      let content;
      (rsp.data as any[]).forEach((d, i, data) => {
        try {
          data[i].via = clientToVia(data[i].client);
          data[i].sysMetal = toMetal(data[i].sysMetal);
          content = JSON.parse(d.content);
          if (content.msgType !== 'redPacket') return rsp;
          if (content.recivers) content.recivers = JSON.parse(content.recivers);
          data[i].content = content;
        } catch (e) {}
      });

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 撤回消息，普通成员 24 小时内可撤回一条自己的消息，纪律委员/OP/管理员角色可以撤回任意人消息
   * @param oId 消息 Id
   */
  async revoke(oId: string): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `chat-room/revoke/${oId}`,
        method: 'delete',
        data: {
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 发送一条消息
   * @param msg 消息内容，支持 Markdown
   */
  async send(msg: string, clientType?: ClientType | string, version?: string): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `chat-room/send`,
        method: 'post',
        data: {
          content: msg,
          client: `${clientType || this.client}/${version || this.version}`,
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 发送一条弹幕
   * @param msg 消息内容，支持 Markdown
   * @param color 弹幕颜色
   */
  async barrage(msg: string, color: string = '#ffffff'): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `chat-room/send`,
        method: 'post',
        data: {
          content: `[barrager]{\"color\":\"${color}\",\"content\":\"${msg}\"}[/barrager]`,
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取弹幕发送价格
   * @returns 返回价格`cost`与单位`unit`
   */
  async barragePay(): Promise<{ cost: number; unit: string }> {
    let rsp;
    try {
      rsp = await request({
        url: `chat-room/barrager/get?apiKey=${this.apiKey}`,
        method: 'get',
      });

      if (rsp.code != 0) throw new Error(rsp.msg);

      // 解析格式如 "5积分" 的字符串
      const mat = rsp.data.match(/([-0-9]+)(.+)/);
      if (mat) {
        return {
          cost: parseInt(mat[1]),
          unit: mat[2],
        };
      }

      return {
        cost: 20,
        unit: '积分',
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取禁言中成员列表（思过崖）
   */
  async mutes(): Promise<IMuteItem[]> {
    let rsp;
    try {
      rsp = await request({
        url: `chat-room/si-guo-list`,
        method: 'get',
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取消息原文（比如 Markdown）
   * @param oId 消息 Id
   */
  async raw(oId: string): Promise<string> {
    let rsp;
    try {
      rsp = await request({
        url: `cr/raw/${oId}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.replace(/<!--.*?-->/g, '');
    } catch (e) {
      throw e;
    }
  }

  /**
   * 红包接口对象
   */
  redpacket = new RedPacket(this, this.apiKey);

  /**
   * 获取聊天室节点
   * @returns 返回节点地址
   */
  async getNode(): Promise<IChatRoomNodeInfo> {
    let rsp: any;
    try {
      rsp = await request({
        url: `chat-room/node/get?apiKey=${this.apiKey}`,
        method: 'get',
      });

      if (rsp.code != 0) throw new Error('获取节点失败：' + rsp.msg);

      return {
        recommend: {
          node: rsp.data,
          name: rsp.msg,
          online: rsp.avaliable.find((n: any) => n.node === rsp.data)?.online || 0,
        },
        avaliable: rsp.avaliable,
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * 连接聊天室
   * @param url 聊天室节点地址
   * @param timeout 超时时间，单位为秒，默认为 10
   * @returns 返回 Open Event
   */
  async connect(reload?: boolean): Promise<ReconnectingWebSocket>;
  async connect(url?: string, timeout?: number): Promise<ReconnectingWebSocket>;
  async connect(urlOrReload?: string | boolean, timeout: number = 10) {
    return new Promise(async (resolve) => {
      let url: string = '';
      if (urlOrReload === undefined || urlOrReload === '' || urlOrReload === true) {
        url = await this.getNode()
          .then((rsp) => rsp.recommend.node)
          .catch(() => `wss://${domain}/chat-room-channel?apiKey=${this.apiKey}`);
      } else {
        url = urlOrReload as string;
      }
      if (!url.includes('apiKey=')) url += `${url.includes('?') ? '&' : '?'}apiKey=${this.apiKey}`;
      if (this.ws) return resolve(this.reconnect());
      this.ws = new ReconnectingWebSocket(url, [], {
        WebSocket,
        ...this.rwsOptions,
        connectionTimeout: 1000 * timeout,
      });

      this.ws.onopen = (e) => {
        if (this.wsTimer) {
          clearInterval(this.wsTimer);
        }
        this.wsTimer = setInterval(
          () => {
            this.ws?.send('-hb-');
          },
          1000 * 60 * 3,
        );
        resolve(e);
        this.emitter.emit('open', e);
      };
      this.ws.onmessage = async (e) => {
        let msg = JSON.parse(e.data);
        let data: any | null = null;
        switch (msg.type) {
          case 'online': {
            this._onlines = msg.users;
            this._discusse = msg.discussing;
            data = this._onlines;
            break;
          }
          case 'discussChanged': {
            data = msg.newDiscuss;
            msg.type = 'discuss';
            break;
          }
          case 'revoke': {
            data = msg.oId;
            break;
          }
          case 'barrager': {
            let {
              barragerContent,
              userAvatarURL,
              userAvatarURL20,
              userNickname,
              barragerColor,
              userName,
              userAvatarURL210,
              userAvatarURL48,
            } = msg;
            data = {
              barragerContent,
              userAvatarURL,
              userAvatarURL20,
              userNickname,
              barragerColor,
              userName,
              userAvatarURL210,
              userAvatarURL48,
            };
            break;
          }
          case 'msg': {
            let { userOId, oId, time, userName, userNickname, userAvatarURL, content, md, client } =
              msg;
            try {
              let data = JSON.parse(content);
              if (['redPacket', 'music', 'weather'].includes(data.msgType)) {
                content = data;
                msg.type = data.msgType;
              }
            } catch (e) {}
            data = {
              type: msg.type,
              userOId,
              oId,
              time,
              userName,
              userNickname,
              userAvatarURL,
              content,
              md,
              client,
              via: clientToVia(client),
            };
            break;
          }
          case 'redPacketStatus': {
            let { oId, count, got, whoGive, whoGot } = msg;
            data = { oId, count, got, whoGive, whoGot };
            break;
          }
          case 'customMessage': {
            data = msg.message;
            msg.type = 'custom';
            break;
          }
        }
        this.emitter.emit(msg.type, data);
        this.emitter.emit('all', data);
      };
      this.ws.onerror = (e) => {
        this.emitter.emit('error', e);
      };
      this.ws.onclose = (e) => {
        this.emitter.emit('close', e);
      };
    });
  }
}

class RedPacket {
  private chatroom: ChatRoom;
  private apiKey: string = '';

  constructor(chatroom: ChatRoom, apiKey: string) {
    this.chatroom = chatroom;
    this.apiKey = apiKey;
  }

  setToken(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 打开一个红包
   * @param oId 红包消息 Id
   * @param gesture 猜拳类型
   */
  async open(oId: string, gesture?: GestureType): Promise<IRedPacketInfo> {
    let rsp;
    try {
      rsp = await request({
        url: `chat-room/red-packet/open`,
        method: 'post',
        data: {
          oId,
          gesture,
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 发送一个红包
   * @param redpacket 红包对象
   */
  async send(redpacket: Redpacket) {
    return await this.chatroom.send(`[redpacket]${JSON.stringify(redpacket)}[/redpacket]`);
  }
}
