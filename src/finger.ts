import { MetalBase } from './types';
import { analyzeMetalAttr, request } from './utils';

export class Finger
{
    private goldFingerKey:string = '';

    constructor(key:string) {
        if (!key) { return; }
        this.goldFingerKey = key;
    }

    /**
     * 设置金手指
     * @param key 金手指密钥
     */
    setFinger(key:string) {
        this.goldFingerKey = key;
    }

    /**
     * 上传摸鱼大闯关关卡数据
     * @param userName: 用户在摸鱼派的用户名
     * @param stage: 关卡数
     * @param time: 通过此关时间（毫秒级时间戳）
     */
    async addMofishScore({ userName, stage, time = (new Date().getTime()) }: { userName: string, stage: string, time: number }): Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `api/games/mofish/score`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName, stage, time,
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 查询用户最近登录的IP地址
     * @param userName: 用户在摸鱼派的用户名
     */
    async queryLatestLoginIP(userName: string): Promise<IUserIP> {
        let rsp;
        try {
            rsp = await request({
                url: `user/query/latest-login-iP`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName,
                },
            });

            if (rsp.code) throw new Error(rsp.msg)

            return rsp.data;
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 添加勋章
     * @param userName: 用户在摸鱼派的用户名
     * @param metal: 勋章信息
     */
    async addMetal(userName: string, metal: MetalBase): Promise<void> {
        let rsp;
        metal = new MetalBase(metal);
        try {
            rsp = await request({
                url: `user/edit/give-metal`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName, ...metal, attr: metal.attr.toString(),
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 删除勋章
     * @param userName: 用户在摸鱼派的用户名
     * @param name: 勋章名称
     */
    async deleteMetal(userName: string, name: string): Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `user/edit/remove-metal`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName, name,
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 删除勋章By userId
     * @param userId: 用户在摸鱼派的用户ID
     * @param name: 勋章名称
     */
    async deleteMetalByUserId(userId: string, name: string): Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `user/edit/remove-metal-by-user-id`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userId, name,
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 查询用户背包
     * @param userName: 用户在摸鱼派的用户名
     */
    async queryUserBag(userName: string): Promise<IUserBag> {
        let rsp;
        try {
            rsp = await request({
                url: `user/query/items`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName,
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
 
            return rsp;
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 调整用户背包
     * @param userName: 用户在摸鱼派的用户名
     * @param item: 物品名称
     * @param sum: 物品数量
     */
    async editUserBag(userName: string, item: string, sum: number): Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `user/edit/items`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName, item, sum
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 调整用户积分
     * @param userName: 用户在摸鱼派的用户名
     * @param point: 积分数量
     * @param memo: 备注
     */
    async editUserPoints(userName: string, point: number, memo: string): Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `user/edit/points`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName, point, memo
                },
            });

            if (rsp.code) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 查询用户当前活跃度
     * @param userName: 用户在摸鱼派的用户名
     */
    async getLiveness(userName: string): Promise<number> {
        let rsp;
        try {
            rsp = await request({
                url: `user/liveness`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName,
                },
            });

            if (rsp.code !== 0) throw new Error(rsp.msg)

            return rsp.liveness;
        } catch (e) {
            throw e;
        }  
    }

    /**
     * 查询用户昨日活跃度奖励
     * @param userName: 用户在摸鱼派的用户名
     */
    async getYesterDayLivenessReward(userName: string): Promise<number> {
        let rsp;
        try {
            rsp = await request({
                url: `activity/yesterday-liveness-reward-api`,
                method: 'post',
                data: {
                    goldFingerKey: this.goldFingerKey,
                    userName,
                },
            });            

            return rsp.sum;
        } catch (e) {
            throw e;
        }  
    }
}

export default Finger;