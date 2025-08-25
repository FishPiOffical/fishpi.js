export interface ChatEvents {
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
    socketClose: (event: CloseEvent) => void;
    /**
     * 聊天 Websocket 错误
     */
    socketError: (error: ErrorEvent) => void;
}