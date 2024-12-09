import { analyzeMetalAttr, domain, isBrowse, request } from './utils';
import { 
    ApiResponse, ArticlePost, ArticleListType, ArticleDetail, VoteStatus, ArticleList, ArticleType, VoteType
} from './typing';
import ReconnectingWebSocket from 'reconnecting-websocket';

class Article
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
     * 发布文章
     * @param data 文章信息
     * @returns 发布成功返回文章Id (articleId)
     */
    async post(data:ArticlePost):Promise<{ code:number, msg?:string, articleId?:string }> {
        let rsp;
        try {
            rsp = await request({
                url: `article`,
                method: 'post',
                data: {
                    ...data,
                    apiKey: this._apiKey
                },
            });

            return rsp;
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
    async update(id:string, data:ArticlePost):Promise<{ code:number, msg?:string, articleId?:string }> {
        let rsp;
        try {
            rsp = await request({
                url: `article/${id}`,
                method: 'put',
                data: {
                    ...data,
                    apiKey: this._apiKey
                },
            });

            return rsp;
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
    async list(
        { type, page = 1, size = 20, tag }:
        { type:ArticleListType, page?: number, size?: number, tag?:string }
    ):Promise<ApiResponse<ArticleList>> {
        let rsp;
        try {
            rsp = await request({
                url: `api/articles/${
                    tag !== undefined ? `tag/${tag}` : 'recent'
                }${type}?p=${page}&size=${size}&${
                    this._apiKey ? `apiKey=${this._apiKey}` : ''
                }`,
            });         

            return rsp;
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
    async userArticles(
        { userName, page = 1 }: 
        { userName: string, page: number }
    ):Promise<ApiResponse<ArticleList>> {
        let rsp;
        try {
            rsp = await request({
                url: `api/articles/${userName}/articles?p=${page}&${
                    this._apiKey ? `apiKey=${this._apiKey}` : ''
                }`,
            });         

            return rsp;
        } catch (e) {
            throw e;
        }
   }
    
    /**
     * 获取文章详情
     * @param id 文章id
     * @returns 文章详情
     */
    async detail(id:string, p=1):Promise<ApiResponse<{ article: ArticleDetail }>> {
        let rsp;
        try {
            rsp = await request({
                url: `api/article/${id}?apiKey=${this._apiKey}&p=${p}`,
            });

            rsp.data.article.articleAuthor.sysMetal = analyzeMetalAttr(rsp.data.article.articleAuthor.sysMetal);

            for(let i = 0; i < rsp.data.article.articleComments.length; i++) {
                rsp.data.article.articleComments[i].sysMetal = analyzeMetalAttr(rsp.data.article.articleComments[i].sysMetal);
            }

            for(let i = 0; i < rsp.data.article.articleNiceComments.length; i++) {
                rsp.data.article.articleNiceComments[i].sysMetal = analyzeMetalAttr(rsp.data.article.articleNiceComments[i].sysMetal);
            }

            return rsp;
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
    async vote(id:string, type:'up' | 'down'):Promise<{ code:number, msg?:string, type?:VoteType }> {
        let rsp;
        try {
            rsp = await request({
                url: `vote/${type}/article`,
                method: 'post',
                data: {
                    dataId: id,
                    apiKey: this._apiKey
                },
            });

            return rsp;
        } catch (e) {
            throw e;
        }    
    }

    /**
     * 感谢文章
     * @param id 文章id
     */
    async thank(id:string):Promise<ApiResponse<undefined>> {
        let rsp;
        try {
            rsp = await request({
                url: `article/thank?articleId=${id}`,
                method: 'post',
                data: {
                    apiKey: this._apiKey
                },
            });

            return rsp;
        } catch (e) {
            throw e;
        }    
    }

    /**
     * 收藏/取消收藏文章
     * @param id 文章id
     */
    async follow(followingId:string):Promise<ApiResponse<undefined>> {
        let rsp;
        try {
            rsp = await request({
                url: `follow/article`,
                method: 'post',
                data: {
                    apiKey: this._apiKey,
                    followingId
                },
            });

            return rsp;
        } catch (e) {
            throw e;
        }    
    }

    /**
     * 关注/取消关注文章
     * @param followingId 文章id
     */
    async watch(followingId:string):Promise<ApiResponse<undefined>> {
        let rsp;
        try {
            rsp = await request({
                url: `follow/article-watch`,
                method: 'post',
                data: {
                    apiKey: this._apiKey,
                    followingId
                },
            });

            return rsp;
        } catch (e) {
            throw e;
        }    
    }

    /**
     * 打赏文章
     * @param id 文章id
     */
    async reward(id:string):Promise<ApiResponse<undefined>> {
        let rsp;
        try {
            rsp = await request({
                url: `article/reward?articleId=${id}`,
                method: 'post',
                data: {
                    apiKey: this._apiKey,
                },
            });

            return rsp;
        } catch (e) {
            throw e;
        }    
    }

    /**
     * 获取文章在线人数
     * @param id 文章id
     */
    async heat(id:string):Promise<number> {
        let rsp;
        try {
            rsp = await request({
                url: `api/article/heat/${id}?apiKey=${this._apiKey}`,
                method: 'get',
            });

            if (rsp.code) throw new Error(rsp.msg)

            return rsp.articleHeat;
        } catch (e) {
            throw e;
        }    
    }

    /**
     * 添加文章监听器
     * @param id 文章id
     * @param type 文章类型
     * @param callback 监听回调
     */
    async addListener({ id, type=0 }: { id: string, type: ArticleType }, callback:(ev: any) => void) {
        const rws = new ReconnectingWebSocket(
            `wss://${domain}/article-channel?articleId=${id}&articleType=${type}&apiKey=${this._apiKey}`, [], {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                WebSocket: isBrowse ? window.WebSocket : (await import('ws')).WebSocket,
                connectionTimeout: 10000
            }
        );

        rws.onopen = (e) => {
        };
        rws.onmessage = callback;
        rws.onerror = ((e) => {
            console.error(e);
        });
        rws.onclose = ((e) => {
            console.log(e);
        });
        return rws
    }
}

export default Article;