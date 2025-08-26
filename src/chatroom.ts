import ReconnectingWebSocket from 'reconnecting-websocket';
import { request, domain, toMetal, isBrowse, clientToVia } from './utils';
import { ChatRoomEvents } from './types';
import { EventEmitter } from 'events';

export class ChatRoom {
    private _apiKey:string = '';
    private _discusse:string = '';
    private _onlines:IOnlineInfo[]=[];
    private _rws:ReconnectingWebSocket | null = null;
    private _wsTimer:NodeJS.Timeout | null = null;
    private _client:ClientType | string = ClientType.Other;
    private _version:string = 'Latest';
    private emitter = new EventEmitter();

    constructor(token:string='') {
        if (!token) { return; }
        this._apiKey = token;
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
        this.send(`[setdiscuss]${val}[/setdiscuss]`);
    }

    /**
     * 重新设置请求 Token
     * @param apiKey 接口 API Key
     */
    setToken(apiKey:string) {
        this._apiKey = apiKey;
        this.redpacket.setToken(apiKey);
    }

    /**
     * 设置当前来源类型
     * @param client 来源类型
     * @param version 版本号
     */
    setVia(client:ClientType | string, version:string) {
        this._client = client;
        this._version = version;
    }

    /**
     * 查询聊天室历史消息
     * @param page 消息页码
     */
    async more(page=1, type=ChatContentType.HTML):Promise<IChatRoomMessage[]> {
        try {
            let rsp = await request({
                url: `chat-room/more?page=${page}&type=${type}&apiKey=${this._apiKey}`
            });

            if (rsp.code != 0) {
                throw new Error(rsp.msg);
            }

            if (!rsp.data) return rsp;
            let redpacket;
            (rsp.data as Array<any>).forEach((d, i, data) => {
                try {
                    data[i].via = clientToVia(data[i].client)
                    data[i].sysMetal = toMetal(data[i].sysMetal);
                    data[i].content = JSON.parse(d.content);
                    if (data[i].content.recivers) data[i].content.recivers = JSON.parse(data[i].content.recivers);
                } catch (e) {}
            })

            return rsp.data;
        } catch (e) {
            throw e;
        }
    }

    async get({
        oId, mode, size=25, type
    }:{ oId:string, mode:ChatMessageType.Context, size:number, type:ChatContentType.HTML }):Promise<IChatRoomMessage[]> {
        try {
            let rsp = await request({
                url: `chat-room/getMessage?oId=${oId}&mode=${mode}&size=${size}&type=${type}&apiKey=${this._apiKey}`
            });

            if (rsp.code != 0) {
                throw new Error(rsp.msg);
            }

            if (!rsp.data) return rsp;
            let redpacket;
            (rsp.data as any[]).forEach((d, i, data) => {
                try {
                    data[i].via = clientToVia(data[i].client)
                    data[i].sysMetal = toMetal(data[i].sysMetal);
                    redpacket = JSON.parse(d.content);
                    if (redpacket.msgType !== 'redPacket') return rsp;
                    if (redpacket.recivers) redpacket.recivers = JSON.parse(redpacket.recivers);
                    data[i].content = redpacket;
                } catch (e) {}
            })

            return rsp.data;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 撤回消息，普通成员 24 小时内可撤回一条自己的消息，纪律委员/OP/管理员角色可以撤回任意人消息
     * @param oId 消息 Id
     */
     async revoke(oId:string):Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `chat-room/revoke/${oId}`,
                method: 'delete',
                data: {
                    apiKey: this._apiKey
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }
    }

    /**
     * 发送一条消息
     * @param msg 消息内容，支持 Markdown
     */
     async send(msg:string, clientType?: ClientType | string, version?: string):Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `chat-room/send`,
                method: 'post',
                data: {
                    content: msg,
                    client: `${clientType || this._client}/${version || this._version}`,
                    apiKey: this._apiKey
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }
    }

    /**
     * 发送一条弹幕
     * @param msg 消息内容，支持 Markdown
     * @param color 弹幕颜色
     */
    async barrage(msg:string, color:string='#ffffff'):Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `chat-room/send`,
                method: 'post',
                data: {
                    content: `[barrager]{\"color\":\"${color}\",\"content\":\"${msg}\"}[/barrager]`,
                    apiKey: this._apiKey
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
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
                url: `cr?apiKey=${this._apiKey}`,
                method: 'get'
            });

            let mat = rsp.match(/>发送弹幕每次将花费\s*<b>([-0-9]+)<\/b>\s*([^<]*?)<\/div>/);
            if (mat) {
                return {
                    cost: parseInt(mat[1]),
                    unit: mat[2]
                }
            }

            return {
                cost: 20,
                unit: '积分'
            };
        }
        catch (e) {
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

            if (rsp.code) throw new Error(rsp.msg)
 
            return rsp.data;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 获取消息原文（比如 Markdown）
     * @param oId 消息 Id
     */
     async raw(oId:string):Promise<string> {
        let rsp;
        try {
            rsp = await request({
                url: `cr/raw/${oId}`,
            });

            if (rsp.code) throw new Error(rsp.msg)

            return rsp.replace(/<!--.*?-->/g, '');
        } catch (e) {
            throw e;
        }
    }

    /**
     * 红包接口对象
     */
    redpacket = new RedPacket(this, this._apiKey);

    /**
     * 获取聊天室节点
     * @returns 返回节点地址
     */
    async getNode():Promise<IChatRoomNodeInfo> {
        let rsp: any;
        try {
            rsp = await request({
                url: `chat-room/node/get?apiKey=${this._apiKey}`,
                method: 'get',
            });

            if (rsp.code != 0) throw new Error("获取节点失败：" + rsp.msg);            

            return {
                recommend: {
                    node: rsp.data,
                    name: rsp.msg,
                    online: rsp.avaliable.find((n:any) => n.node === rsp.data)?.online || 0
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
     */
    connect(args: { url?:string, timeout?: number }={}) {
        return this.reconnect(args);
    }

    /**
     * 重连聊天室
     * @param url 聊天室节点地址
     * @param timeout 超时时间，单位为秒，默认为 10
     * @returns 返回 Open Event
     */
    async reconnect({ url=``, timeout=10 }: { url?:string, timeout?: number }={}) {
        return new Promise(async (resolve) => {
            if (!url) url = await this.getNode().then((rsp) => rsp.recommend.node).catch(() => `wss://${domain}/chat-room-channel?apiKey=${this._apiKey}`);
            if (!url.includes('apiKey=')) url += `${url.includes('?') ? '&' : '?'}apiKey=${this._apiKey}`;
            if (this._rws) return resolve(this._rws.reconnect());
            this._rws = new ReconnectingWebSocket(url, [], {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    WebSocket: isBrowse ? window.WebSocket : (await import('ws')).WebSocket,
                    connectionTimeout: 1000 * timeout
                }
            );
    
            this._rws.onopen = (e) => {
                if(this._wsTimer) { clearInterval(this._wsTimer); }
                this._wsTimer = setInterval(() => {
                    this._rws?.send('-hb-');
                }, 1000 * 60 * 3);
                resolve(e);
            };
            this._rws.onmessage = async (e) => {
                let msg = JSON.parse(e.data);
                let data:any | null = null;
                switch(msg.type) {
                    case 'online': {
                        this._onlines = msg.users;
                        this._discusse = msg.discussing;
                        data = this._onlines;
                        break;
                    }
                    case 'discussChanged': {
                        data = msg.newDiscuss;
                        break;
                    }
                    case 'revoke': {
                        data = msg.oId;
                        break;
                    }
                    case 'barrager': {
                        let { barragerContent, userAvatarURL, userAvatarURL20, userNickname, barragerColor, userName, userAvatarURL210, userAvatarURL48 } = msg;
                        data = { barragerContent, userAvatarURL, userAvatarURL20, userNickname, barragerColor, userName, userAvatarURL210, userAvatarURL48 };
                        break;
                    }
                    case 'msg': {
                        let { userOId, oId, time, userName, userNickname, userAvatarURL, content, md, client } = msg;
                        try {
                            let data = JSON.parse(content);
                            if (['redPacket', 'music', 'weather'].includes(data.msgType)) {
                                content = data;
                                msg.type = data.msgType;
                            }
                        } catch (e) { }
                        data = { userOId, oId, time, userName, userNickname, userAvatarURL, content, md, client, via: clientToVia(client) };
                        break;
                    }
                    case 'redPacketStatus': {
                        let { oId, count, got, whoGive, whoGot } = msg;
                        data = { oId, count, got, whoGive, whoGot };
                        break;
                    }
                    case 'customMessage': {
                        data = msg.message;
                        break;
                    }
                }
                this.emitter.emit(msg.type, data);
            };
            this._rws.onerror = ((e) => {
                this.emitter.emit('socketError', e);
            });
            this._rws.onclose = ((e) => {
                this.emitter.emit('socketClose', e);
            });
        });
    }

    /**
     * 聊天室监听
     * @param event 聊天室事件
     * @param listener 监听器
     */
    on<K extends keyof ChatRoomEvents>(event: K, listener: ChatRoomEvents[K]) {
        if (this._rws == null) { 
            this.reconnect();
        }
        return this.emitter.on(event, listener);
    }

    /**
     * 移除聊天室监听
     * @param event 聊天室事件
     * @param listener 监听器
     */
    off<K extends keyof ChatRoomEvents>(event: K, listener: ChatRoomEvents[K]) {
        return this.emitter.off(event, listener);
    }

    /**
     * 聊天室单次监听
     * @param event 聊天室事件
     * @param listener 监听器
     */
    once<K extends keyof ChatRoomEvents>(event: K, listener: ChatRoomEvents[K]) {
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
     removeListener<K extends keyof ChatRoomEvents>(event: K, listener: ChatRoomEvents[K]) {
        return this.off(event, listener);
    }

    /**
     * 添加聊天室消息监听函数
     * @param event 聊天室事件
     * @param listener 监听器
     */
     addListener<K extends keyof ChatRoomEvents>(event: K, listener: ChatRoomEvents[K]) {
        return this.on(event, listener);
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
    async open(oId:string, gesture?:GestureType):Promise<IRedPacketInfo> {
        let rsp;
        try {
            rsp = await request({
                url: `chat-room/red-packet/open`,
                method: 'post',
                data: {
                    oId,
                    gesture,
                    apiKey: this.apiKey
                },
            });

            if (rsp.code) throw new Error(rsp.msg)

            return rsp.data;            
        } catch (e) {
            throw e;
        }
    }

    /**
     * 发送一个红包
     * @param redpacket 红包对象
     */
    async send(redpacket:RedPacket) {
        return await this.chatroom.send(`[redpacket]${JSON.stringify(redpacket)}[/redpacket]`)
    }
}

export default ChatRoom;