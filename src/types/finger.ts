/**
 * 摸鱼大闯关信息
 */
export class MoFishGame implements IMoFishGame {
  userName = '';
  stage = '';
  time = 0;
}

/**
 * 用户背包物品类型
 */
export enum UserBagType {
  checkin1day,
  checkin2days,
  patchCheckinCard,
  metalTicket,
}

/**
 * 摸鱼大闯关信息
 */
export interface IMoFishGame {
  userName: string;
  stage: string;
  time: number;
}

/**
 * 用户 IP 信息
 */
export interface IUserIP {
  latestLoginIP: string;
  userId: string;
}

/**
 * 用户背包信息
 */
export interface IUserBag {
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
