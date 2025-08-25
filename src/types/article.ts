/**
 * 发帖信息
 */
export class ArticlePost implements IArticlePost {
    /**
     * 帖子标题
     */
    articleTitle: string = '';
    /**
     * 帖子内容
     */
    articleContent: string = '';
    /**
     * 帖子标签
     */
    articleTags: string = '';
    /**
     * 是否允许评论
     */
    articleCommentable: boolean = true;
    /**
     * 是否帖子关注者
     */
    articleNotifyFollowers: boolean = false;
    /**
     * 帖子类型
     */
    articleType: ArticleType = ArticleType.Normal;
    /**
     * 是否在列表展示
     */
    articleShowInList: 0 | 1 = 1;
    /**
     * 打赏内容
     */
    articleRewardContent?: string;
    /**
     * 打赏积分
     */
    articleRewardPoint?: string;
    /**
     * 是否匿名
     */
    articleAnonymous?: boolean;
    /**
     * 提问悬赏积分
     */
    articleQnAOfferPoint?: number;
}

export class CommentPost implements ICommentPost {
    /**
     * 文章 Id
     */
    articleId: string = '';
    /**
     * 是否匿名评论
     */
    commentAnonymous: boolean = false;
    /**
     * 评论是否楼主可见
     */
    commentVisible: boolean = true;
    /**
     * 评论内容
     */
    commentContent: string = '';
    /**
     * 回复评论 Id
     */
    commentOriginalCommentId?: string;
}
