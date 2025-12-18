import { domain, request, WebSocket } from './utils';
import ReconnectingWebSocket from 'reconnecting-websocket';
import {
  ArticleListType,
  ArticlePost,
  ArticleType,
  ArticleDetail,
  ArticleList,
  VoteType,
  IArticlePost,
  IArticleHeat,
  ArticleComment,
} from './';
import { IWebSocketEvent, WsEventBase } from './ws';

interface IArticleEvents extends IWebSocketEvent {
  heat: (msg: IArticleHeat) => void;
  comment: (msg: ArticleComment) => void;
}

export class Article {
  private apiKey: string = '';
  private channels: { [key: string]: ArticleChannel } = {};

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
   * 发布文章
   * @param data 文章信息
   * @returns 发布成功返回文章Id (articleId)
   */
  async post(data: IArticlePost): Promise<string> {
    let rsp;
    try {
      rsp = await request({
        url: `article`,
        method: 'post',
        data: {
          ...ArticlePost.from(data).toJson(),
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.articleId;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 更新文章
   * @param id 文章 Id
   * @param data 文章信息
   * @returns 更新成功返回文章Id (articleId)
   */
  async update(id: string, data: IArticlePost): Promise<string> {
    let rsp;
    try {
      rsp = await request({
        url: `article/${id}`,
        method: 'put',
        data: {
          ...ArticlePost.from(data).toJson(),
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.articleId;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 查询文章列表
   * @param type 查询类型
   * @param tag 指定查询标签，可选
   * @returns 文章列表
   */
  async list({
    type,
    page = 1,
    size = 20,
    tag,
  }: {
    type: ArticleListType;
    page?: number;
    size?: number;
    tag?: string;
  }): Promise<ArticleList> {
    let rsp;
    try {
      rsp = await request({
        url: `api/articles/${
          tag ? `tag/${tag}` : 'recent'
        }${type}?p=${page}&size=${size}&${this.apiKey ? `apiKey=${this.apiKey}` : ''}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return ArticleList.from(rsp.data);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 查询用户文章列表
   * @param userName 用户名
   * @param page 页码
   * @returns 文章列表
   */
  async userArticles({
    userName,
    page = 1,
    size = 20,
  }: {
    userName: string;
    page?: number;
    size?: number;
  }): Promise<ArticleList> {
    let rsp;
    try {
      rsp = await request({
        url: `api/user/${userName}/articles?p=${page}&size=${size}&${
          this.apiKey ? `apiKey=${this.apiKey}` : ''
        }`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return ArticleList.from(rsp.data);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取文章详情
   * @param id 文章id
   * @returns 文章详情
   */
  async detail(id: string, p = 1): Promise<ArticleDetail> {
    let rsp;
    try {
      rsp = await request({
        url: `api/article/${id}?apiKey=${this.apiKey}&p=${p}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return ArticleDetail.from(rsp.data.article);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 点赞/取消点赞文章
   * @param id 文章id
   * @param type 点赞类型
   * @returns 文章点赞状态
   */
  async vote(id: string, type: 'up' | 'down'): Promise<VoteType> {
    let rsp;
    try {
      rsp = await request({
        url: `vote/${type}/article`,
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
   * 感谢文章
   * @param id 文章id
   */
  async thank(id: string): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `article/thank?articleId=${id}`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 收藏/取消收藏文章
   * @param id 文章id
   */
  async follow(followingId: string): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `follow/article`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
          followingId,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 关注/取消关注文章
   * @param followingId 文章id
   */
  async watch(followingId: string): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `follow/article-watch`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
          followingId,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 打赏文章
   * @param id 文章id
   */
  async reward(id: string): Promise<void> {
    let rsp;
    try {
      rsp = await request({
        url: `article/reward?articleId=${id}`,
        method: 'post',
        data: {
          apiKey: this.apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取文章在线人数
   * @param id 文章id
   */
  async heat(id: string): Promise<number> {
    let rsp;
    try {
      rsp = await request({
        url: `api/article/heat/${id}?apiKey=${this.apiKey}`,
        method: 'get',
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp.articleHeat;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 获取帖子的Markdown原文
   * @param articleId 文章Id
   */
  async md(articleId: string): Promise<string> {
    let rsp;
    try {
      rsp = await request({
        url: `api/article/md/${articleId}?apiKey=${this.apiKey}`,
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp;
    } catch (e) {
      throw e;
    }
  }

  channel(id: string, type: ArticleType): ArticleChannel {
    if (!this.channels[id]) this.channels[id] = new ArticleChannel(this.apiKey, id, type);
    return this.channels[id];
  }
}

export class ArticleChannel extends WsEventBase<IArticleEvents> {
  private apiKey: string = '';
  private id: string = '';
  private type: ArticleType = ArticleType.Normal;

  constructor(token: string, id: string, type: ArticleType) {
    super();
    if (!token) {
      return;
    }
    this.apiKey = token;
  }
  /**
   * 添加文章监听器
   * @param id 文章id
   * @param type 文章类型
   * @param callback 监听回调
   */
  async connect(reload?: boolean): Promise<ReconnectingWebSocket> {
    return new Promise(async (resolve, reject) => {
      if (this.ws && !reload) return resolve(this.ws);
      if (this.ws) this.ws.close();
      if (!this.apiKey) return reject(new Error('请先设置 API Key'));

      this.ws = new ReconnectingWebSocket(
        `wss://${domain}/article-channel?articleId=${this.id}&articleType=${this.type}&apiKey=${this.apiKey}`,
        [],
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          WebSocket,
          connectionTimeout: 10000,
        },
      );

      this.ws.onopen = (e) => {
        this.emitter.emit('open', e);
      };
      this.ws.onmessage = (ev: MessageEvent) => {
        let msg = JSON.parse(ev.data);
        let eventType = msg.type;
        if (eventType === 'articleHeat') {
          this.emitter.emit('heat', msg.data);
        } else {
          this.emitter.emit(msg.type, ArticleComment.from(msg.data));
        }
      };
      this.ws.onerror = (e) => {
        this.emitter.emit('error', e);
      };
      this.ws.onclose = (e) => {
        this.emitter.emit('close', e);
      };
      return this.ws;
    });
  }
}
