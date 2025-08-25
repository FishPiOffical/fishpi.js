/**
 * 红包数据
 */
export class RedPacket implements IRedPacket {
    /**
     * 红包类型
     */
    type: RedPacketType= RedPacketType.Random;
    /**
     * 红包积分
     */
    money: number = 32;
    /**
     * 红包个数
     */
    count: number = 1;
    /**
     * 祝福语
     */
    msg: string = '摸鱼者，事竟成';
    /**
     * 接收者，专属红包有效
     */
    recivers?: Array<string>;
    /**
     * 出拳，猜拳红包有效
     */
    gesture?: GestureType;
}

