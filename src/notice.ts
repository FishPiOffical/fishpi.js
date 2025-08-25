import { request } from './utils';

export class Notice
{
    private _apiKey:string = '';

    constructor(token:string='') {
        if (!token) { return; }
        this._apiKey = token;
    }

    /**
     * 重新设置请求 Token
     * @param apiKey 接口 API Key
     */
    setToken(token:string) {
        this._apiKey = token;
    }

    /**
     * 获取未读消息数
     */
     async count():Promise<INoticeCount> {
        let rsp;
        try {
            rsp = await request({
                url: `notifications/unread/count?apiKey=${this._apiKey}`,
            });

            if (rsp.code !== 0) throw new Error(rsp.msg)

            if (rsp.userNotifyStatus) rsp.userNotifyStatus = rsp.userNotifyStatus != 0;
            return rsp;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 获取消息列表
     * @param type 消息类型
     */
     async list(type: NoticeType | string):Promise<NoticeList> {
        let rsp;
        try {
            rsp = await request({
                url: `api/getNotifications?apiKey=${this._apiKey}&type=${type}`,
            });

            if (rsp.code !== 0) throw new Error(rsp.msg)

            return rsp.data;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 已读指定类型消息
     * @param type 消息类型
     */
     async makeRead(type: NoticeType | string):Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `notifications/make-read/${type}?apiKey=${this._apiKey}`,
            });

            if (rsp.code !== 0) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }
    }

    /**
     * 已读所有消息
     */
     async readAll():Promise<void> {
        let rsp;
        try {
            rsp = await request({
                url: `notifications/all-read?apiKey=${this._apiKey}`,
            });

            if (rsp.code !== 0) throw new Error(rsp.msg)
        } catch (e) {
            throw e;
        }
    }
}

export default Notice;