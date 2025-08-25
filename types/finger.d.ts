/**
 * 摸鱼大闯关信息
 */ 
declare interface IMoFishGame {
    userName: string;
    stage: string;
    time: number;
}

/**
 * 用户 IP 信息
 */
declare interface IUserIP {
    latestLoginIP: string;
    userId: string;
}

/**
 * 用户背包物品类型
 */
declare enum UserBagType {
    checkin1day,
    checkin2days,
    patchCheckinCard,
    metalTicket,
}

/**
 * 用户背包信息
 */
declare interface IUserBag {
    /**
     * 免签卡
     */
    checkin1day: number;

    /**
     * 两日免签卡
     */
    checkin2days: number;

    /**
     * 补签卡
     */
    patchCheckinCard: number;

    /**
     * 摸鱼派一周年纪念勋章领取券
     */
    metalTicket: number;
}
