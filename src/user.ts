import { UserInfo } from './';
import { request, toMetal } from './utils';

export class User {
  private apiKey: string = '';

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
   * 返回登录账户信息，需要先登录或设置有效的 api key
   * @returns 用户信息
   */
  async info(): Promise<UserInfo> {
    try {
      let rsp = await request({
        url: `api/user?apiKey=${this.apiKey}`,
      });

      if (rsp.code != 0) throw new Error(rsp.msg);

      if (rsp.data) rsp.data.sysMetal = toMetal(rsp.data.sysMetal);

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 查询登录用户常用表情
   * @returns 常用表情列表
   */
  async emotions(): Promise<Array<string>> {
    let rsp;
    try {
      rsp = await request({
        url: `users/emotions?apiKey=${this.apiKey}`,
      });

      if (rsp.code != 0) throw new Error(rsp.msg);

      rsp.data = Object.keys(rsp.data);
      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 查询登录用户当前活跃度，请求频率请控制在 30 ~ 60 秒一次
   * @returns 活跃度
   */
  async liveness(): Promise<number> {
    if (!this.apiKey) {
      return 0;
    }
    try {
      let rsp = await request({
        url: `user/liveness?apiKey=${this.apiKey}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.liveness || 0;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 检查登录用户是否已经签到
   * @returns 是否已经签到
   */
  async isCheckIn(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }
    try {
      let rsp = await request({
        url: `user/checkedIn?apiKey=${this.apiKey}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.checkedIn || false;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 检查登录用户是否已经领取昨日活跃奖励
   * @returns 是否已经领取昨日活跃奖励
   */
  async isCollectedLiveness(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }
    try {
      let rsp = await request({
        url: `api/activity/is-collected-liveness?apiKey=${this.apiKey}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.isCollectedYesterdayLivenessReward || false;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 领取昨日活跃度奖励
   * @returns sum 领取的奖励积分
   */
  async rewardLiveness(): Promise<number> {
    if (!this.apiKey) {
      return 0;
    }
    try {
      let rsp = await request({
        url: `activity/yesterday-liveness-reward-api?apiKey=${this.apiKey}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.sum || 0;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 转账
   * @param userName 转账目标用户名
   * @param amount 转账金额
   * @param memo 转账备注
   * @returns code 0 为成功，失败则有 msg
   */
  async transfer(userName: string, amount: number, memo: string): Promise<void> {
    try {
      let rsp = await request({
        method: 'POST',
        url: `point/transfer`,
        data: {
          apiKey: this.apiKey,
          userName,
          amount,
          memo,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }
}
