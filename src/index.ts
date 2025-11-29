import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import md5 from 'js-md5';
import { domain, isBrowse, request, setDomain, toMetal } from './utils';
import { ChatRoom, Notice, Emoji, User, Article, Comment, Chat, Breezemoon, Finger } from './';
import {
  IAtUser,
  ILog,
  IUploadInfo,
  IReport,
  UserInfo,
  Account,
  PreRegisterInfo,
  RegisterInfo,
} from './';
import { IUserLite, UserVIP } from './cli';

export class FishPi {
  /**
   *  请求 API 的 API Key
   */
  private apiKey: string = '';
  /**
   *  聊天室接口对象
   */
  readonly chatroom: ChatRoom = new ChatRoom();
  /**
   *  通知接口对象
   */
  readonly notice: Notice = new Notice();
  /**
   *  表情包接口对象
   */
  readonly emoji: Emoji = new Emoji();
  /**
   *  用户接口对象
   */
  readonly account: User = new User();
  /**
   *  文章接口对象
   */
  readonly article: Article = new Article();
  /**
   *  评论接口对象
   */
  readonly comment: Comment = new Comment();
  /**
   *  清风明月对象
   */
  readonly breezemoon: Breezemoon = new Breezemoon();
  /**
   * 私聊接口对象
   */
  readonly chat: Chat = new Chat();

  /**
   * 构造一个 API 请求对象
   * @param token 接口 API Key，没有可以传空
   */
  constructor(token: string = '') {
    if (!token) {
      return;
    }
    this.setToken(token);
  }

  get version() {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')).version;
  }

  async setToken(apiKey: string) {
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

  async setDomain(domain: string) {
    setDomain(domain);
  }

  /**
   * 登录账号返回 API Key
   * @param data 用户账密
   */
  async login(data: Account): Promise<string> {
    try {
      let rsp = await request({
        url: 'api/getKey',
        method: 'post',
        data: {
          nameOrEmail: data.username,
          userPassword: md5(data.passwd),
          mfaCode: data.mfaCode,
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
  async preRegister(data: PreRegisterInfo): Promise<void> {
    try {
      let rsp = await request({
        url: 'register',
        method: 'post',
        data: {
          userName: data.username,
          userPhone: data.phone,
          invitecode: data.invitecode,
          captcha: data.captcha,
        },
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
  async verify(code: string): Promise<number> {
    try {
      let rsp = await request({
        url: 'verify?code=' + code,
        method: 'get',
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
  async register(data: RegisterInfo): Promise<void> {
    try {
      let rsp = await request({
        url: `register2${data.r ? `?r=${data.r}` : ''}`,
        method: 'post',
        data: {
          userAppRole: data.role,
          userPassword: md5(data.passwd),
          userId: data.userId,
        },
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
  async user(username: string): Promise<UserInfo | undefined> {
    try {
      let rsp = await request({
        url: `user/${username}${this.apiKey ? `?apiKey=${this.apiKey}` : ''}`,
      });

      if (rsp.code && rsp.code !== 0) return;

      return UserInfo.from(rsp);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 查询指定用户 oId 的用户信息
   */
  async userByoId(oId: string): Promise<IUserLite | undefined> {
    try {
      let rsp = await request({
        url: `api/user/getInfoById?userId=${oId}`,
      });

      if (rsp.code && rsp.code !== 0) return;

      return { ...rsp.data, oId };
    } catch (e) {
      throw e;
    }
  }

  /**
   * 用户名联想，通常用于 @ 列表
   * @param username 用户名
   */
  async names(name: string): Promise<IAtUser[]> {
    let rsp;
    try {
      rsp = await request({
        url: `users/names`,
        method: 'post',
        data: {
          name,
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
  async recentRegister(): Promise<{ userNickname: string; userName: string }[]> {
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
   * 获取用户 VIP 信息
   * @param userId 用户 oId
   */
  async vipInfo(userId: string): Promise<UserVIP> {
    let rsp;
    try {
      rsp = await request({
        url: `api/membership/${userId}`,
        method: 'get',
      });

      if (rsp.code != 0) throw new Error(rsp.msg);

      if (rsp.data.config) {
        rsp.data.config = JSON.parse(rsp.data.config);
      }

      return UserVIP.from(rsp.data);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 举报
   * @param data 举报信息
   */
  async report(data: IReport): Promise<void> {
    try {
      let rsp = await request({
        url: `report`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
          ...data,
        },
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
  async log({ page = 1, pageSize = 30 }): Promise<ILog[]> {
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
  async upload(files: Array<File | string>): Promise<IUploadInfo> {
    let data: any;

    if (isBrowse) {
      data = new FormData();
      files.forEach((f) => data.append('file[]', f));
    } else {
      data = new FormData();
      files.forEach((f) =>
        data.append('file[]', fs.readFileSync(f.toString()), path.basename(f.toString())),
      );
    }

    data.append('apiKey', this.apiKey);

    let rsp;
    try {
      rsp = await request({
        url: `upload`,
        method: 'post',
        data,
        headers: isBrowse ? undefined : data.getHeaders(),
      });

      if (rsp.code != 0) throw new Error(rsp.msg);

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 生成登录认证地址
   * @param redirect 登录成功后跳转的地址
   */
  generateAuthURL(redirect: string): string {
    const redirectOrigin = new URL(redirect).origin;
    return `https://${domain}/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=${encodeURIComponent(redirect)}&openid.realm=${encodeURIComponent(redirectOrigin)}&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select`;
  }

  /**
   * 校验登录回调
   * @param query 验证返回的地址 QueryString 参数
   * @returns 验证成功则返回用户简略信息，否则返回 undefined
   */
  async authVerify(query: Record<string, string>): Promise<IUserLite | undefined> {
    const openVerify = {
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'check_authentication',
      'openid.op_endpoint': query['openid.op_endpoint'],
      'openid.return_to': query['openid.return_to'],
      'openid.identity': query['openid.identity'],
      'openid.claimed_id': query['openid.claimed_id'],
      'openid.response_nonce': query['openid.response_nonce'],
      'openid.assoc_handle': query['openid.assoc_handle'],
      'openid.sig': query['openid.sig'],
    };
    let rsp;
    try {
      rsp = await request({
        url: `openid/verify`,
        method: 'post',
        data: openVerify,
      });

      if (rsp.includes('is_valid:true')) {
        const claimed_id = query['openid.claimed_id']?.split('/').pop();
        if (!claimed_id) return;
        return await this.userByoId(claimed_id);
      } else {
        return;
      }
    } catch (e) {
      throw e;
    }
  }
}

export * from './chatroom';
export * from './notice';
export * from './emoji';
export * from './user';
export * from './article';
export * from './comment';
export * from './chat';
export * from './breezemoon';
export * from './finger';
export * from './types';

export function FingerTo(key: string) {
  return new Finger(key);
}

export default FishPi;
