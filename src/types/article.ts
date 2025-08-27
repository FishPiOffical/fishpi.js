import { IMetal } from '.';

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

/**
 * 帖子类型
 */
export enum ArticleType {
  Normal,
  Private,
  Broadcast,
  Thought,
  Question,
}

/**
 * 公开状态
 */
export enum PublicStatus {
  Public,
  Private,
}

/**
 * 投票状态，点赞与否
 */
export enum VoteStatus {
  /**
   * 未投票
   */
  normal = -1,
  /**
   * 点赞
   */
  up,
  /**
   * 点踩
   */
  down,
}

/**
 * 是否状态
 */
export enum YesNoStatus {
  Yes,
  No,
}

/**
 * 文章状态
 */
export enum ArticleStatus {
  /**
   * 正常
   */
  Normal,
  /**
   * 封禁
   */
  Ban,
  /**
   * 锁定
   */
  Lock,
}

/**
 * 帖子列表查询类型
 */
export enum ArticleListType {
  /**
   * 最近
   */
  Recent,
  /**
   * 热门
   */
  Hot = '/hot',
  /**
   * 点赞
   */
  Good = '/good',
  /**
   * 最近回复
   */
  Reply = '/reply',
  /**
   * 优选，需包含标签
   */
  Perfect = '/perfact',
}

/**
 * 点赞类型
 */
export enum VoteType {
  /**
   * 点赞
   */
  Voted,
  /**
   * 取消点赞
   */
  Unvote = -1,
}

/**
 * 发帖信息
 */
export interface IArticlePost {
  /**
   * 帖子标题
   */
  articleTitle: string;
  /**
   * 帖子内容
   */
  articleContent: string;
  /**
   * 帖子标签
   */
  articleTags: string;
  /**
   * 是否允许评论
   */
  articleCommentable: boolean;
  /**
   * 是否帖子关注者
   */
  articleNotifyFollowers: boolean;
  /**
   * 帖子类型
   */
  articleType: ArticleType;
  /**
   * 是否在列表展示
   */
  articleShowInList: 0 | 1;
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

/**
 * 文章标签
 */
export interface IArticleTag {
  /**
   * 标签 id
   */
  oId: string;
  /**
   * 标签名
   */
  tagTitle: string;
  /**
   * 标签描述
   */
  tagDescription: string;
  /**
   * icon 地址
   */
  tagIconPath: string;
  /**
   * 标签地址
   */
  tagURI: string;
  /**
   * 标签自定义 CSS
   */
  tagCSS: string;
  /**
   * 反对数
   */
  tagBadCnt: number;
  /**
   * 标签回帖计数
   */
  tagCommentCount: number;
  /**
   * 关注数
   */
  tagFollowerCount: number;
  /**
   * 点赞数
   */
  tagGoodCnt: number;
  /**
   * 引用计数
   */
  tagReferenceCount: number;
  /**
   * 标签相关链接计数
   */
  tagLinkCount: number;
  /**
   * 标签 SEO 描述
   */
  tagSeoDesc: string;
  /**
   * 标签关键字
   */
  tagSeoKeywords: string;
  /**
   * 标签 SEO 标题
   */
  tagSeoTitle: string;
  /**
   * 标签广告内容
   */
  tagAd: string;
  /**
   * 是否展示广告
   */
  tagShowSideAd: 0 | 1;
  /**
   * 标签状态
   */
  tagStatus: 0 | 1;
  /**
   * 标签随机数
   */
  tagRandomDouble: number;
}

/**
 * 文章作者信息
 */
export interface IAuthor {
  /**
   * 用户是否在线
   */
  userOnlineFlag: boolean;
  /**
   * 用户在线时长
   */
  onlineMinute: number;
  /**
   * 是否公开积分列表
   */
  userPointStatus: PublicStatus;
  /**
   * 是否公开关注者列表
   */
  userFollowerStatus: PublicStatus;
  /**
   * 用户完成新手指引步数
   */
  userGuideStep: number;
  /**
   * 是否公开在线状态
   */
  userOnlineStatus: PublicStatus;
  /**
   * 上次登录日期
   */
  userCurrentCheckinStreakStart: number;
  /**
   * 是否聊天室图片自动模糊
   */
  chatRoomPictureStatus: boolean;
  /**
   * 用户标签
   */
  userTags: string;
  /**
   * 是否公开回帖列表
   */
  userCommentStatus: PublicStatus;
  /**
   * 用户时区
   */
  userTimezone: string;
  /**
   * 用户个人主页
   */
  userURL: string;
  /**
   * 是否启用站外链接跳转页面
   */
  userForwardPageStatus: boolean;
  /**
   * 是否公开 UA 信息
   */
  userUAStatus: PublicStatus;
  /**
   * 自定义首页跳转地址
   */
  userIndexRedirectURL: string;
  /**
   * 最近发帖时间
   */
  userLatestArticleTime: number;
  /**
   * 标签计数
   */
  userTagCount: number;
  /**
   * 昵称
   */
  userNickname: string;
  /**
   * 回帖浏览模式
   */
  userListViewMode: 0 | 1;
  /**
   * 最长连续签到
   */
  userLongestCheckinStreak: number;
  /**
   * 用户头像类型
   */
  userAvatarType: number;
  /**
   * 用户确认邮件发送时间
   */
  userSubMailSendTime: number;
  /**
   * 用户最后更新时间
   */
  userUpdateTime: number;
  /**
   * userSubMailStatus
   */
  userSubMailStatus: YesNoStatus;
  /**
   * 是否加入积分排行
   */
  userJoinPointRank: YesNoStatus;
  /**
   * 用户最后登录时间
   */
  userLatestLoginTime: number;
  /**
   * 应用角色
   */
  userAppRole: number;
  /**
   * 头像查看模式
   */
  userAvatarViewMode: number;
  /**
   * 用户状态
   */
  userStatus: number;
  /**
   * 用户上次最长连续签到日期
   */
  userLongestCheckinStreakEnd: number;
  /**
   * 是否公开关注帖子列表
   */
  userWatchingArticleStatus: PublicStatus;
  /**
   * 上次回帖时间
   */
  userLatestCmtTime: number;
  /**
   * 用户省份
   */
  userProvince: string;
  /**
   * 用户当前连续签到计数
   */
  userCurrentCheckinStreak: number;
  /**
   * 用户编号
   */
  userNo: number;
  /**
   * 用户头像
   */
  userAvatarURL: string;
  /**
   * 是否公开关注标签列表
   */
  userFollowingTagStatus: PublicStatus;
  /**
   * 用户语言
   */
  userLanguage: string;
  /**
   * 是否加入消费排行
   */
  userJoinUsedPointRank: YesNoStatus;
  /**
   * 上次签到日期
   */
  userCurrentCheckinStreakEnd: number;
  /**
   * 是否公开收藏帖子列表
   */
  userFollowingArticleStatus: PublicStatus;
  /**
   * 是否启用键盘快捷键
   */
  userKeyboardShortcutsStatus: YesNoStatus;
  /**
   * 是否回帖后自动关注帖子
   */
  userReplyWatchArticleStatus: YesNoStatus;
  /**
   * 回帖浏览模式
   */
  userCommentViewMode: number;
  /**
   * 是否公开清风明月列表
   */
  userBreezemoonStatus: PublicStatus;
  /**
   * 用户上次签到时间
   */
  userCheckinTime: number;
  /**
   * 用户消费积分
   */
  userUsedPoint: number;
  /**
   * 是否公开帖子列表
   */
  userArticleStatus: PublicStatus;
  /**
   * 用户积分
   */
  userPoint: number;
  /**
   * 用户回帖数量
   */
  userCommentCount: number;
  /**
   * 用户个性签名
   */
  userIntro: string;
  /**
   * 移动端主题
   */
  userMobileSkin: string;
  /**
   * 分页每页条目
   */
  userListPageSize: number;
  /**
   * 文章 Id
   */
  oId: string;
  /**
   * 用户名
   */
  userName: string;
  /**
   * 是否公开 IP 地理信息
   */
  userGeoStatus: PublicStatus;
  /**
   * 最长连续签到起始日
   */
  userLongestCheckinStreakStart: number;
  /**
   * 用户主题
   */
  userSkin: string;
  /**
   * 是否启用 Web 通知
   */
  userNotifyStatus: YesNoStatus;
  /**
   * 公开关注用户列表
   */
  userFollowingUserStatus: PublicStatus;
  /**
   * 文章数
   */
  userArticleCount: number;
  /**
   * 用户角色
   */
  userRole: string;
  /**
   * 徽章
   */
  sysMetal?: IMetal[];
}

export interface IPagination {
  /**
   * 评论分页数
   */
  paginationPageCount: string;
  /**
   * 建议分页页码
   */
  paginationPageNums: Array<number>;
}

/**
 * 文章详情
 */
export interface IArticleDetail {
  /**
   * 是否在列表展示
   */
  articleShowInList: boolean;
  /**
   * 文章创建时间
   */
  articleCreateTime: string;
  /**
   * 发布者Id
   */
  articleAuthorId: string;
  /**
   * 反对数
   */
  articleBadCnt: number;
  /**
   * 文章最后修改时间
   */
  articleLatestCmtTime: string;
  /**
   * 赞同数
   */
  articleGoodCnt: number;
  /**
   * 悬赏积分
   */
  articleQnAOfferPoint: number;
  /**
   * 作者头像缩略图
   */
  articleThumbnailURL: string;
  /**
   * 置顶序号
   */
  articleStickRemains: number;
  /**
   * 发布时间简写
   */
  timeAgo: string;
  /**
   * 文章更新时间
   */
  articleUpdateTimeStr: string;
  /**
   * 作者用户名
   */
  articleAuthorName: string;
  /**
   * 文章类型
   */
  articleType: ArticleType;
  /**
   * 是否悬赏
   */
  offered: boolean;
  /**
   * 文章创建时间字符串
   */
  articleCreateTimeStr: string;
  /**
   * 文章浏览数
   */
  articleViewCount: number;
  /**
   * 作者头像缩略图
   */
  articleAuthorThumbnailURL20: string;
  /**
   * 关注数
   */
  articleWatchCnt: number;
  /**
   * 文章预览内容
   */
  articlePreviewContent: string;
  /**
   * 文章标题
   */
  articleTitleEmoj: string;
  /**
   * 文章标题
   */
  articleTitleEmojUnicode: string;
  /**
   * 文章标题
   */
  articleTitle: string;
  /**
   * 作者头像缩略图
   */
  articleAuthorThumbnailURL48: string;
  /**
   * 文章评论数
   */
  articleCommentCount: number;
  /**
   * 收藏数
   */
  articleCollectCnt: number;
  /**
   * 文章最后评论者
   */
  articleLatestCmterName: string;
  /**
   * 文章标签
   */
  articleTags: string;
  /**
   * 文章 id
   */
  oId: string;
  /**
   * 最后评论时间简写
   */
  cmtTimeAgo: string;
  /**
   * 是否置顶
   */
  articleStick: number;
  /**
   * 文章标签信息
   */
  articleTagObjs: Array<IArticleTag>;
  /**
   * 文章最后评论时间
   */
  articleLatestCmtTimeStr: string;
  /**
   * 是否匿名
   */
  articleAnonymous: boolean;
  /**
   * 文章感谢数
   */
  articleThankCnt: number;
  /**
   * 文章更新时间
   */
  articleUpdateTime: string;
  /**
   * 文章状态
   */
  articleStatus: ArticleStatus;
  /**
   * 文章点击数
   */
  articleHeat: number;
  /**
   * 文章是否优选
   */
  articlePerfect: boolean;
  /**
   * 作者头像缩略图
   */
  articleAuthorThumbnailURL210: string;
  /**
   * 文章固定链接
   */
  articlePermalink: string;
  /**
   * 作者用户信息
   */
  articleAuthor: IAuthor;
  /**
   * 文章感谢数
   */
  thankedCnt?: number;
  /**
   * 文章匿名浏览量
   */
  articleAnonymousView?: number;
  /**
   * 文章浏览量简写
   */
  articleViewCntDisplayFormat?: string;
  /**
   * 文章是否启用评论
   */
  articleCommentable?: boolean;
  /**
   * 是否已打赏
   */
  rewarded?: boolean;
  /**
   * 打赏人数
   */
  rewardedCnt?: number;
  /**
   * 文章打赏积分
   */
  articleRewardPoint?: number;
  /**
   * 是否已收藏
   */
  isFollowing?: boolean;
  /**
   * 是否已关注
   */
  isWatching?: boolean;
  /**
   * 是否是我的文章
   */
  isMyArticle?: boolean;
  /**
   * 是否已感谢
   */
  thanked?: boolean;
  /**
   * 编辑器类型
   */
  articleEditorType?: number;
  /**
   * 文章音频地址
   */
  articleAudioURL?: string;
  /**
   * 文章目录 HTML
   */
  articleToC?: string;
  /**
   * 文章内容 HTML
   */
  articleContent?: string;
  /**
   * 文章内容 Markdown
   */
  articleOriginalContent?: string;
  /**
   * 文章缩略图
   */
  articleImg1URL?: string;
  /**
   * 文章点赞状态
   */
  articleVote?: VoteStatus;
  /**
   * 文章随机数
   */
  articleRandomDouble?: number;
  /**
   * 作者签名
   */
  articleAuthorIntro?: string;
  /**
   * 发布城市
   */
  articleCity?: string;
  /**
   * 发布者 IP
   */
  articleIP?: string;
  /**
   * 作者首页地址
   */
  articleAuthorURL?: string;
  /**
   * 推送 Email 推送顺序
   */
  articlePushOrder?: number;
  /**
   * 打赏内容
   */
  articleRewardContent?: string;
  /**
   * reddit分数
   */
  redditScore?: string;
  /**
   * 评论分页信息
   */
  pagination?: IPagination;
  /**
   * 评论是否可见
   */
  discussionViewable: boolean;
  /**
   * 文章修改次数
   */
  articleRevisionCount: number;
  /**
   * 文章的评论
   */
  articleComments?: Array<IArticleComment>;
  /**
   * 文章最佳评论
   */
  articleNiceComments?: Array<IArticleComment>;
}

/**
 * 文章评论
 */
export interface IArticleComment {
  /**
   * 是否优评
   */
  commentNice: boolean;
  /**
   * 评论创建时间字符串
   */
  commentCreateTimeStr: string;
  /**
   * 评论作者 id
   */
  commentAuthorId: string;
  /**
   * 评论分数
   */
  commentScore: number;
  /**
   * 评论创建时间
   */
  commentCreateTime: string;
  /**
   * 评论作者头像
   */
  commentAuthorURL: string;
  /**
   * 评论状态
   */
  commentVote: VoteStatus;
  /**
   * 评论引用数
   */
  commentRevisionCount: number;
  /**
   * 评论经过时间
   */
  timeAgo: string;
  /**
   * 回复评论 id
   */
  commentOriginalCommentId: string;
  /**
   * 徽章
   */
  sysMetal: IMetal[];
  /**
   * 点赞数
   */
  commentGoodCnt: number;
  /**
   * 评论是否可见
   */
  commentVisible: YesNoStatus;
  /**
   * 文章 id
   */
  commentOnArticleId: string;
  /**
   * 评论感谢数
   */
  rewardedCnt: number;
  /**
   * 评论地址
   */
  commentSharpURL: string;
  /**
   * 是否匿名
   */
  commentAnonymous: boolean;
  /**
   * 评论回复数
   */
  commentReplyCnt: number;
  /**
   * 评论 id
   */
  oId: string;
  /**
   * 评论内容
   */
  commentContent: string;
  /**
   * 评论状态
   */
  commentStatus: ArticleStatus;
  /**
   * 评论作者
   */
  commenter: IAuthor;
  /**
   * 评论作者用户名
   */
  commentAuthorName: string;
  /**
   * 评论感谢数
   */
  commentThankCnt: number;
  /**
   * 评论点踩数
   */
  commentBadCnt: number;
  /**
   * 是否已感谢
   */
  rewarded: boolean;
  /**
   * 评论作者头像
   */
  commentAuthorThumbnailURL: string;
  /**
   * 评论音频地址
   */
  commentAudioURL: string;
  /**
   * 评论是否采纳，1 表示采纳
   */
  commentQnAOffered: number;
}

/**
 * 文章列表
 */
export interface IArticleList {
  /**
   * 文章列表
   */
  articles: Array<IArticleDetail>;
  /**
   * 分页信息
   */
  pagination: IPagination;
  /**
   * 标签信息，仅查询标签下文章列表有效
   */
  tag?: IArticleTag;
}

export interface ICommentPost {
  /**
   * 文章 Id
   */
  articleId: string;
  /**
   * 是否匿名评论
   */
  commentAnonymous: boolean;
  /**
   * 评论是否楼主可见
   */
  commentVisible: boolean;
  /**
   * 评论内容
   */
  commentContent: string;
  /**
   * 回复评论 Id
   */
  commentOriginalCommentId?: string;
}
