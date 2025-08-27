import { CommentPost, VoteType } from './';
import { request } from './utils';

export class Comment {
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
   * 发布评论
   * @param data 评论信息
   */
  async send(data: CommentPost): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `comment`,
        method: 'post',
        data: {
          ...data,
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 更新评论
   * @param id 评论 Id
   * @param data 评论信息
   */
  async update(id: string, data: CommentPost): Promise<string> {
    let rsp;
    try {
      rsp = await request({
        url: `comment/${id}`,
        method: 'put',
        data: {
          ...data,
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.commentContent;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 评论点赞
   * @param id 评论 Id
   * @param type 点赞类型
   */
  async vote(id: string, type: 'up' | 'down'): Promise<VoteType> {
    let rsp;
    try {
      rsp = await request({
        url: `vote/${type}/comment`,
        method: 'post',
        data: {
          dataId: id,
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.type;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 评论感谢
   * @param id 评论 Id
   */
  async thank(id: string): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `comment/thank`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
          commentId: id,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 删除评论
   * @param id 评论 Id
   */
  async remove(id: string): Promise<string> {
    let rsp;
    try {
      rsp = await request({
        url: `comment/${id}/remove`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.commentId;
    } catch (e) {
      throw e;
    }
  }
}
