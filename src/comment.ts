import { CommentPost, ICommentPost, VoteType } from './';
import { request } from './utils';

/**
 * 摸鱼派评论接口
 */
export class Comment {
  /**
   * 接口 API Key
   */
  private apiKey: string = '';

  /**
   * 各个模块的实例化
   * @param token 认证 Token
   */
  constructor(token: string = '') {
    if (!token) {
      return;
    }
    this.apiKey = token;
  }

  /**
   * 重新设置请求 Token
   * @param token 接口 API Key
   */
  setToken(token: string) {
    this.apiKey = token;
  }

  /**
   * 发布评论
   * @param data 评论信息
   * @returns void
   */
  async send(data: ICommentPost): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `comment`,
        method: 'post',
        data: {
          ...CommentPost.from(data).toJson(),
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
   * @returns 评论内容
   */
  async update(id: string, data: ICommentPost): Promise<string> {
    let rsp;
    try {
      rsp = await request({
        url: `comment/${id}`,
        method: 'put',
        data: {
          ...CommentPost.from(data).toJson(),
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
   * @returns 投票状态
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
