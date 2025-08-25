import { isBrowse, request, setDomain, toMetal } from './utils';
import {
    Account, UserInfo,  PreRegisterInfo, RegisterInfo, Report,
    ChatRoom, Notice, Emoji, User, Article, Comment, Chat, Breezemoon, Finger,
} from './';

import md5 from 'js-md5'

export class FishPi {
    /**
     *  请求 API 的 API Key
     */
    apiKey: string = '';
    /**
     *  聊天室接口对象
     */
    chatroom: ChatRoom = new ChatRoom();
    /**
     *  通知接口对象
     */
    notice: Notice = new Notice();
    /**
     *  表情包接口对象
     */
    emoji: Emoji = new Emoji();
    /**
     *  用户接口对象
     */
    account: User = new User();
    /**
     *  文章接口对象
     */
    article: Article = new Article();
    /**
     *  评论接口对象
     */
    comment: Comment = new Comment();
    /**
     *  清风明月对象
     */
    breezemoon: Breezemoon = new Breezemoon();
    /**
    * 私聊接口对象
    */
    chat: Chat = new Chat();

    /**
     * 构造一个 API 请求对象
     * @param token 接口 API Key，没有可以传空
     */
    constructor(token: string = '') {
        if (!token) { return; }
        this.setToken(token);
    }

    async setToken (apiKey: string) {
        this.apiKey = apiKey;
        this.chatroom.setToken(this.apiKey);
        this.notice.setToken(this.apiKey);
        this.emoji.setToken(this.apiKey);
        this.account.setToken(this.apiKey);
        this.article.setToken(this.apiKey);
        this.comment.setToken(this.apiKey);
        this.breezemoon.setToken(this.apiKey);
        this.chat.setToken(this.apiKey);
    }

    async setDomain (domain: string) {
        setDomain(domain);
    }

    /**
     * 登录账号返回 API Key
     * @param data 用户账密
     */
    async login (data: Account): Promise<string> {
        try {
            let rsp = await request({
                url: 'api/getKey',
                method: 'post',
                data: {
                    nameOrEmail: data.username,
                    userPassword: md5(data.passwd),
                    mfaCode: data.mfaCode
                },
            });

            if (rsp.code != 0) throw new Error(rsp.msg);

            this.setToken(rsp.Key);

            return rsp.Key;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 预注册账号
     * @param data 用户信息
     * @returns 
     */
    async preRegister (data: PreRegisterInfo): Promise<void> {
        try {
            let rsp = await request({
                url: 'register',
                method: 'post',
                data: {
                    userName: data.username,
                    userPhone: data.phone,
                    invitecode: data.invitecode,
                    captcha: data.captcha,
                }
            });

            if (rsp.code != 0) throw new Error(rsp.msg);
        } catch (e) {
            throw e;
        }
    }

    /**
     * 验证手机验证码
     * @param code 验证码
     * @returns 
     */
    async verify (code: string): Promise<number> {
        try {
            let rsp = await request({
                url: 'verify?code=' + code,
                method: 'get'
            });

            if (rsp.code != 0) throw new Error(rsp.msg);

            return rsp.userId;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 注册账号
     */
    async register (data: RegisterInfo): Promise<void> {
        try {
            let rsp = await request({
                url: `register2${data.r ? `?r=${data.r}` : ''}`,
                method: 'post',
                data: {
                    userAppRole: data.role,
                    userPassword: md5(data.passwd),
                    userId: data.userId
                }
            });

            if (rsp.code != 0) throw new Error(rsp.msg);
        } catch (e) {
            throw e;
        }
    }

    /**
     * 查询指定用户信息
     * @param username 用户名
     */
    async user (username: string): Promise<UserInfo | undefined> {
        try {
            let rsp = await request({
                url: `user/${username}${this.apiKey ? `?apiKey=${this.apiKey}` : ''}`
            });

            if (rsp.code != 0) return;

            rsp.sysMetal = toMetal(rsp.sysMetal);
            rsp.allMetalOwned = toMetal(rsp.allMetalOwned);

            return rsp;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 用户名联想，通常用于 @ 列表
     * @param username 用户名
     */
    async names (name: string): Promise<IAtUser[]> {
        let rsp;
        try {
            rsp = await request({
                url: `users/names`,
                method: 'post',
                data: {
                    name
                },
            });

            return rsp.data || [];
        } catch (e) {
            throw e;
        }
    }

    /**
     * 获取最近注册的20个用户
     */
    async recentRegister (): Promise<{ userNickname: string; userName: string; }[]> {
        let rsp;
        try {
            rsp = await request({
                url: `api/user/recentReg`,
                method: 'get',
            });

            return rsp.data || [];
        } catch (e) {
            throw e;
        }
    }

    /**
     * 举报
     * @param data 举报信息
     */
    async report (data: Report): Promise<void> {
        try {
            let rsp = await request({
                url: `report`,
                method: 'post',
                data: {
                    apiKey: this.apiKey,
                    ...data,
                }
            });

            if (rsp.code != 0) throw new Error(rsp.msg);

            return rsp;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 获取操作日志
     * @param page 页码
     * @param pageSize 每页数量
     */
    async log ({
        page = 1,
        pageSize = 30,
    }): Promise<ILog[]> {
        try {
            let rsp = await request({
                url: `/logs/more?page=${page}&pageSize=${pageSize}`,
                method: 'get',
            });

            if (rsp.code != 0) throw new Error(rsp.msg);

            return rsp.data;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 上传文件
     * @param files 要上传的文件，如果是在 Node 使用，则传入文件路径数组，若是在浏览器使用，则传入文件对象数组。
     */
    async upload (files: Array<File | string>): Promise<IUploadInfo> {
        let data: any;

        if (!isBrowse && !globalThis.FormData)
            globalThis.FormData = (await import('form-data')).default as any;

        if (isBrowse) {
            data = new FormData();
            files.forEach(f => data.append('file[]', f));
        } else {
            data = new FormData();
            files.forEach(f => data.append('file[]',
                require('fs').readFileSync(f.toString()),
                require('path').basename(f.toString())
            ));
        }

        data.append('apiKey', this.apiKey);

        let rsp;
        try {
            rsp = await request({
                url: `upload`,
                method: 'post',
                data,
                headers: isBrowse ? undefined : data.getHeaders()
            });

            if (rsp.code != 0) throw new Error(rsp.msg);

            return rsp.data;
        } catch (e) {
            throw e;
        }
    }

}

export { default as ChatRoom } from './chatroom';
export { default as Notice } from './notice';
export { default as Emoji } from './emoji';
export { default as User } from './user';
export { default as Article } from './article';
export { default as Comment } from './comment';
export { default as Chat } from './chat';
export { default as Breezemoon } from './breezemoon';
export { default as Finger } from './finger';

export * from './types';

export function FingerTo (key: string) {
    return new Finger(key);
}

export default FishPi;
