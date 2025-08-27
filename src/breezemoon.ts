import { IBreezemoonContent } from '.';
import { request } from './utils';

export class Breezemoon {
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
   * 获取清风明月列表
   * @param page 消息页码
   * @param size 每页个数
   */
  async list(page = 1, size = 20): Promise<IBreezemoonContent[]> {
    try {
      let rsp = await request({
        url: `api/breezemoons?p=${page}&size=${size}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.breezemoons;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取用户清风明月列表
   * @param user 用户名
   * @param page 消息页码
   * @param size 每页个数
   */
  async listByUser(user: string, page = 1, size = 20): Promise<IBreezemoonContent[]> {
    try {
      let rsp = await request({
        url: `api/user/${user}/breezemoons?p=${page}&size=${size}&apiKey=${this.apiKey}`,
      });

      return rsp.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 发送清风明月
   * @param content 内容
   */
  async send(content: string): Promise<void> {
    try {
      let rsp = await request({
        url: `breezemoon`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
          breezemoonContent: content,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }
}
