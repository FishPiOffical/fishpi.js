import { ErrorEvent, CloseEvent } from "reconnecting-websocket";

export class ChatRoomSource implements IChatRoomSource {
    /**
     * 消息来源
     */
    client: ClientType | string = ClientType.Other;
    /**
     * 消息来源版本
     */
    version: string = 'latest';
}

export interface ChatRoomEvents {
    /**
     * 在线用户变更
     * @param onlines 在线用户
     */
    online: (onlines: IOnlineInfo[]) => void;
    /**
     * 话题变更
     * @param discuss 话题
     */
    discussChanged: (discuss: discussMsg) => void;
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
    redPacket: (redpacket: IRedPacketInfo) => void;
    /**
     * 音乐消息
     * @param music 音乐消息内容
     */
    music: (music: IChatMusic) => void;
    /**
     * 天气消息
     * @param weather 天气消息内容
     */
    weather: (weather: IChatWeather) => void;
    /**
     * 红包领取
     * @param status 红包领取状态
     */
    redPacketStatus: (status: IRedPacketStatusMsg) => void;
    /**
     * 进出通知
     * @param msg 进出通知内容
     */
    customMessage: (msg: CustomMsg) => void;
    /**
     * 聊天 Websocket 关闭
     */
    socketClose: (event: CloseEvent) => void;
    /**
     * 聊天 Websocket 错误
     */
    socketError: (error: ErrorEvent) => void;
}