import { IMetal, Pagination } from '.';

/**
 * 发帖信息
 */
export class ArticlePost implements IArticlePost {
  /**
   * 帖子标题
   */
  title: string = '';
  /**
   * 帖子内容
   */
  content: string = '';
  /**
   * 帖子标签
   */
  tags: string = '';
  /**
   * 是否允许评论
   */
  commentable: boolean = true;
  /**
   * 是否通知帖子关注者
   */
  isNotifyFollowers: boolean = false;
  /**
   * 帖子类型
   */
  type: ArticleType = ArticleType.Normal;
  /**
   * 是否在列表展示
   */
  isShowInList = true;
  /**
   * 打赏内容
   */
  rewardContent?: string;
  /**
   * 打赏积分
   */
  rewardPoint?: number;
  /**
   * 是否匿名
   */
  isAnonymous?: boolean;
  /**
   * 提问悬赏积分
   */
  offerPoint?: number;

  static from(article: IArticlePost) {
    return Object.assign(new ArticlePost(), article);
  }

  toJson() {
    return {
      articleTitle: this.title,
      articleContent: this.content,
      articleTags: this.tags,
      articleCommentable: this.commentable,
      articleNotifyFollowers: this.isNotifyFollowers,
      articleType: this.type,
      articleShowInList: this.isShowInList ? 1 : 0,
      articleRewardContent: this.rewardContent,
      articleRewardPoint: this.rewardPoint,
      articleAnonymous: this.isAnonymous,
      articleQnAOfferPoint: this.offerPoint,
    };
  }
}

export class CommentPost implements ICommentPost {
  /**
   * 文章 Id
   */
  articleId: string = '';
  /**
   * 是否匿名评论
   */
  isAnonymous: boolean = false;
  /**
   * 评论是否公共可见
   */
  isVisible: boolean = true;
  /**
   * 评论内容
   */
  content: string = '';
  /**
   * 回复评论 Id
   */
  originalId?: string;

  static from(comment: ICommentPost) {
    return Object.assign(new CommentPost(), comment);
  }

  toJson() {
    return {
      articleId: this.articleId,
      commentAnonymous: this.isAnonymous ? 1 : 0,
      commentVisible: this.isVisible ? 1 : 0,
      commentContent: this.content,
      commentOriginalCommentId: this.originalId,
    };
  }
}

/**
 * 帖子类型
 */
export enum ArticleType {
  Normal,
  Private,
  Broadcast,
  Thought,
  Question = 5,
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
  Recent = '',
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
  title: string;
  /**
   * 帖子内容
   */
  content: string;
  /**
   * 帖子标签
   */
  tags: string;
  /**
   * 帖子类型
   */
  type?: ArticleType;
  /**
   * 是否允许评论
   */
  commentable?: boolean;
  /**
   * 是否帖子关注者
   */
  isNotifyFollowers?: boolean;
  /**
   * 是否在列表展示
   */
  isShowInList?: boolean;
  /**
   * 打赏内容
   */
  rewardContent?: string;
  /**
   * 打赏积分
   */
  rewardPoint?: number;
  /**
   * 是否匿名
   */
  isAnonymous?: boolean;
  /**
   * 提问悬赏积分
   */
  offerPoint?: number;
}

/**
 * 文章标签
 */
export class ArticleTag {
  /**
   * 标签 id
   */
  oId: string = '';
  /**
   * 标签名
   */
  title: string = '';
  /**
   * 标签描述
   */
  description: string = '';
  /**
   * icon 地址
   */
  iconPath: string = '';
  /**
   * 标签地址
   */
  URI: string = '';
  /**
   * 标签自定义 CSS
   */
  CSS: string = '';
  /**
   * 反对数
   */
  badCnt: number = 0;
  /**
   * 标签回帖计数
   */
  commentCount: number = 0;
  /**
   * 关注数
   */
  followerCount: number = 0;
  /**
   * 点赞数
   */
  goodCnt: number = 0;
  /**
   * 引用计数
   */
  referenceCount: number = 0;
  /**
   * 标签相关链接计数
   */
  linkCount: number = 0;
  /**
   * 标签 SEO 描述
   */
  seoDesc: string = '';
  /**
   * 标签关键字
   */
  seoKeywords: string = '';
  /**
   * 标签 SEO 标题
   */
  seoTitle: string = '';
  /**
   * 标签广告内容
   */
  ad: string = '';
  /**
   * 是否展示广告
   */
  isShowSideAd = true;
  /**
   * 标签状态
   */
  status: 0 | 1 = 1;

  static from(tag: Record<string, any>) {
    const data = new ArticleTag();
    data.oId = tag.oId;
    data.title = tag.tagTitle;
    data.description = tag.tagDescription;
    data.iconPath = tag.tagIconPath;
    data.URI = tag.tagURI;
    data.CSS = tag.tagCSS;
    data.badCnt = tag.tagBadCnt;
    data.commentCount = tag.tagCommentCount;
    data.followerCount = tag.tagFollowerCount;
    data.goodCnt = tag.tagGoodCnt;
    data.referenceCount = tag.tagReferenceCount;
    data.linkCount = tag.tagLinkCount;
    data.seoDesc = tag.tagSeoDesc;
    data.seoKeywords = tag.tagSeoKeywords;
    data.seoTitle = tag.tagSeoTitle;
    data.ad = tag.tagAd;
    data.isShowSideAd = tag.tagShowSideAd == 1;
    data.status = tag.tagStatus;

    return data;
  }
}

/**
 * 文章作者信息
 */
export class Author {
  /**
   * 用户是否在线
   */
  online: boolean = false;
  /**
   * 用户在线时长
   */
  onlineMinute: number = 0;
  /**
   * 用户标签
   */
  tags: string = '';
  /**
   * 用户时区
   */
  timezone: string = '';
  /**
   * 用户个人主页
   */
  URL: string = '';
  /**
   * 最近发帖时间
   */
  latestArticleTime: number = 0;
  /**
   * 昵称
   */
  nickname: string = '';
  /**
   * 应用角色
   */
  appRole: number = 0;
  /**
   * 用户状态
   */
  status: number = 0;
  /**
   * 用户省份
   */
  province: string = '';
  /**
   * 用户当前连续签到计数
   */
  currentCheckinStreak: number = 0;
  /**
   * 用户编号
   */
  userNo: number = 0;
  /**
   * 用户头像
   */
  avatarURL: string = '';
  /**
   * 用户语言
   */
  language: string = '';
  /**
   * 用户消费积分
   */
  usedPoint: number = 0;
  /**
   * 用户积分
   */
  points: number = 0;
  /**
   * 用户回帖数量
   */
  commentCount: number = 0;
  /**
   * 用户个性签名
   */
  intro: string = '';
  /**
   * 用户 Id
   */
  oId: string = '';
  /**
   * 用户名
   */
  userName: string = '';
  /**
   * 文章数
   */
  articleCount: number = 0;
  /**
   * 用户角色
   */
  role: string = '';
  /**
   * 徽章
   */
  sysMetal?: IMetal[];
  /**
   * MBTI 性格类型
   */
  mbti: string = '';

  static from(user: Record<string, any>) {
    const data = new Author();
    data.online = user.userOnlineFlag;
    data.onlineMinute = user.onlineMinute;
    data.tags = user.userTags;
    data.timezone = user.userTimezone;
    data.URL = user.userURL;
    data.latestArticleTime = user.userLatestArticleTime;
    data.nickname = user.userNickname;
    data.appRole = user.userAppRole;
    data.status = user.userStatus;
    data.province = user.userProvince;
    data.currentCheckinStreak = user.userCurrentCheckinStreak;
    data.userNo = user.userNo;
    data.avatarURL = user.userAvatarURL;
    data.language = user.userLanguage;
    data.usedPoint = user.userUsedPoint;
    data.points = user.userPoint;
    data.commentCount = user.userCommentCount;
    data.intro = user.userIntro;
    data.oId = user.oId;
    data.userName = user.userName;
    data.articleCount = user.userArticleCount;
    data.role = user.userRole;
    if (user.sysMetal) data.sysMetal = user.sysMetal;
    data.mbti = user.mbti;

    return data;
  }
}

/**
 * 文章详情
 */
export class ArticleDetail {
  /**
   * 是否在列表展示
   */
  isShowInList: boolean = true;
  /**
   * 发布者Id
   */
  authorId: string = '';
  /**
   * 反对数
   */
  badCnt: number = 0;
  /**
   * 文章最后修改时间
   */
  latestCmtTime: string = '';
  /**
   * 赞同数
   */
  goodCnt: number = 0;
  /**
   * 悬赏积分
   */
  offerPoint: number = 0;
  /**
   * 文章首图缩略图
   */
  thumbnailURL: string = '';
  /**
   * 置顶序号
   */
  stickRemains: number = 0;
  /**
   * 发布时间简写
   */
  timeAgo: string = '';
  /**
   * 文章更新时间
   */
  updateTime: string = '';
  /**
   * 作者用户名
   */
  authorName: string = '';
  /**
   * 文章类型
   */
  type: ArticleType = ArticleType.Normal;
  /**
   * 是否悬赏
   */
  isOffered: boolean = false;
  /**
   * 文章创建时间字符串
   */
  createTime: string = '';
  /**
   * 文章浏览数
   */
  viewCount: number = 0;
  /**
   * 作者头像缩略图
   */
  authorThumbnail20: string = '';
  /**
   * 关注数
   */
  watchCnt: number = 0;
  /**
   * 文章预览内容
   */
  previewContent: string = '';
  /**
   * 文章标题
   */
  titleEmoj: string = '';
  /**
   * 文章标题
   */
  titleEmojUnicode: string = '';
  /**
   * 文章标题
   */
  title: string = '';
  /**
   * 作者头像缩略图
   */
  authorThumbnail48: string = '';
  /**
   * 收藏数
   */
  collectCnt: number = 0;
  /**
   * 文章最后评论者
   */
  latestCmter: string = '';
  /**
   * 文章标签
   */
  tagsContent: string = '';
  /**
   * 文章 id
   */
  oId: string = '';
  /**
   * 最后评论时间简写
   */
  cmtTimeAgo: string = '';
  /**
   * 是否置顶
   */
  stick: number = 0;
  /**
   * 文章标签信息
   */
  tags: ArticleTag[] = [];
  /**
   * 是否匿名
   */
  isAnonymous: boolean = false;
  /**
   * 文章感谢数
   */
  thankCnt: number = 0;
  /**
   * 文章状态
   */
  status: ArticleStatus = ArticleStatus.Normal;
  /**
   * 文章点击数
   */
  heat: number = 0;
  /**
   * 文章是否优选
   */
  isPerfect: boolean = false;
  /**
   * 作者头像缩略图
   */
  authorThumbnail210: string = '';
  /**
   * 文章固定链接
   */
  permalink: string = '';
  /**
   * 作者用户信息
   */
  author: Author = new Author();
  /**
   * 文章感谢数
   */
  thankedCnt?: number = 0;
  /**
   * 文章匿名浏览量
   */
  anonymousView?: number = 0;
  /**
   * 文章浏览量简写
   */
  viewCntDisplay?: string = '';
  /**
   * 文章是否启用评论
   */
  commentable?: boolean = true;
  /**
   * 是否已打赏
   */
  isRewarded?: boolean = false;
  /**
   * 打赏人数
   */
  rewardedCnt?: number = 0;
  /**
   * 文章打赏积分
   */
  rewardPoint?: number = 0;
  /**
   * 是否已收藏
   */
  isFollowing?: boolean = false;
  /**
   * 是否已关注
   */
  isWatching?: boolean = false;
  /**
   * 是否是我的文章
   */
  isMyArticle?: boolean = false;
  /**
   * 是否已感谢
   */
  isThanked?: boolean = false;
  /**
   * 文章音频地址
   */
  audioURL?: string = '';
  /**
   * 文章目录 HTML
   */
  tableOfContents?: string = '';
  /**
   * 文章内容 HTML
   */
  content?: string = '';
  /**
   * 文章内容 Markdown
   */
  originalContent?: string = '';
  /**
   * 文章首图
   */
  img1URL?: string = '';
  /**
   * 文章点赞状态
   */
  vote?: VoteStatus = VoteStatus.normal;
  /**
   * 作者签名
   */
  authorIntro?: string = '';
  /**
   * 发布城市
   */
  city?: string = '';
  /**
   * 作者首页地址
   */
  authorURL?: string = '';
  /**
   * 打赏内容
   */
  rewardContent?: string = '';
  /**
   * 评论分页信息
   */
  pagination?: Pagination;
  /**
   * 评论是否可见
   */
  discussionViewable: boolean = true;
  /**
   * 文章修改次数
   */
  revisionCount: number = 0;
  /**
   * 文章的评论
   */
  comments?: Array<ArticleComment>;
  /**
   * 文章最佳评论
   */
  niceComments?: Array<ArticleComment>;

  static from(post: Record<string, any>) {
    const data = new ArticleDetail();
    data.isShowInList = post.articleShowInList;
    data.authorId = post.articleAuthorId;
    data.badCnt = post.articleBadCnt;
    data.goodCnt = post.articleGoodCnt;
    data.offerPoint = post.articleQnAOfferPoint;
    data.thumbnailURL = post.articleThumbnailURL;
    data.stickRemains = post.articleStickRemains;
    data.timeAgo = post.timeAgo;
    data.updateTime = post.articleUpdateTimeStr;
    data.authorName = post.articleAuthorName;
    data.type = post.articleType;
    data.isOffered = post.articleQnAOfferPoint > 0;
    data.createTime = post.articleCreateTimeStr;
    data.viewCount = post.articleViewCount;
    data.authorThumbnail20 = post.articleAuthorThumbnailURL20;
    data.watchCnt = post.articleWatchCnt;
    data.previewContent = post.articlePreviewContent;
    data.titleEmoj = post.articleTitleEmoj;
    data.titleEmojUnicode = post.articleTitleEmojUnicode;
    data.title = post.articleTitle;
    data.authorThumbnail48 = post.articleAuthorThumbnailURL48;
    data.collectCnt = post.articleCollectCnt;
    data.latestCmter = post.articleLatestCmterName;
    data.tagsContent = post.articleTags;
    data.oId = post.oId;
    data.cmtTimeAgo = post.cmtTimeAgo;
    data.stick = post.articleStick;
    data.tags = post.articleTagObjs?.map((t: any) => ArticleTag.from(t)) || [];
    data.latestCmtTime = post.articleLatestCmtTimeStr;
    data.isAnonymous = post.articleAnonymous;
    data.thankCnt = post.articleThankCnt;
    data.status = post.articleStatus;
    data.heat = post.articleHeat;
    data.isPerfect = post.articlePerfect;
    data.authorThumbnail210 = post.articleAuthorThumbnailURL210;
    data.permalink = post.articlePermalink;
    if (post.articleAuthor) data.author = Author.from(post.articleAuthor);
    data.thankedCnt = post.thankedCnt;
    data.anonymousView = post.articleAnonymousView;
    data.viewCntDisplay = post.articleViewCntDisplayFormat;
    data.commentable = post.articleCommentable;
    data.isRewarded = post.rewarded;
    data.rewardedCnt = post.rewardedCnt;
    data.rewardPoint = post.articleRewardPoint;
    data.isFollowing = post.isFollowing;
    data.isWatching = post.isWatching;
    data.isMyArticle = post.isMyArticle;
    data.isThanked = post.thanked;
    data.audioURL = post.articleAudioURL;
    data.tableOfContents = post.articleToC;
    data.content = post.articleContent;
    data.originalContent = post.articleOriginalContent;
    data.img1URL = post.articleImg1URL;
    data.vote = post.articleVote;
    data.authorIntro = post.articleAuthorIntro;
    data.city = post.articleCity;
    data.authorURL = post.articleAuthorURL;
    data.rewardContent = post.articleRewardContent;
    if (post.pagination) data.pagination = Pagination.from(post.pagination);
    data.discussionViewable = post.discussionViewable;
    data.revisionCount = post.articleRevisionCount;
    data.comments = post.articleComments
      ? post.articleComments.map((c: any) => ArticleComment.from(c))
      : undefined;
    data.niceComments = post.articleNiceComments
      ? post.articleNiceComments.map((c: any) => ArticleComment.from(c))
      : undefined;
    return data;
  }
}

/**
 * 文章评论
 */
export class ArticleComment {
  /**
   * 是否优评
   */
  isNice: boolean = false;
  /**
   * 评论创建时间字符串
   */
  createTime: string = '';
  /**
   * 评论作者 id
   */
  authorId: string = '';
  /**
   * 评论分数
   */
  score: number = 0;
  /**
   * 评论作者头像
   */
  authorURL: string = '';
  /**
   * 评论状态
   */
  vote: VoteStatus = VoteStatus.normal;
  /**
   * 评论引用数
   */
  revisionCount: number = 0;
  /**
   * 评论经过时间
   */
  timeAgo: string = '';
  /**
   * 回复评论 id
   */
  originalId: string = '';
  /**
   * 徽章
   */
  sysMetal: IMetal[] = [];
  /**
   * 点赞数
   */
  goodCnt: number = 0;
  /**
   * 评论是否可见
   */
  visible: YesNoStatus = YesNoStatus.Yes;
  /**
   * 文章 id
   */
  articleId: string = '';
  /**
   * 评论感谢数
   */
  rewardedCnt: number = 0;
  /**
   * 评论地址
   */
  sharpURL: string = '';
  /**
   * 是否匿名
   */
  isAnonymous: boolean = false;
  /**
   * 评论回复数
   */
  replyCnt: number = 0;
  /**
   * 评论 id
   */
  oId: string = '';
  /**
   * 评论内容
   */
  content: string = '';
  /**
   * 评论状态
   */
  status: ArticleStatus = ArticleStatus.Normal;
  /**
   * 评论作者
   */
  commenter: Author = new Author();
  /**
   * 评论作者用户名
   */
  authorName: string = '';
  /**
   * 评论感谢数
   */
  thankCnt: number = 0;
  /**
   * 评论点踩数
   */
  badCnt: number = 0;
  /**
   * 是否已感谢
   */
  rewarded: boolean = false;
  /**
   * 评论作者头像
   */
  authorThumbnailURL: string = '';
  /**
   * 评论音频地址
   */
  audioURL: string = '';
  /**
   * 评论是否采纳，1 表示采纳
   */
  isOffered: boolean = false;

  static from(cmt: Record<string, any>) {
    const data = new ArticleComment();
    data.isNice = cmt.commentNice;
    data.createTime = cmt.commentCreateTimeStr;
    data.authorId = cmt.commentAuthorId;
    data.score = cmt.commentScore;
    data.authorURL = cmt.commentAuthorURL;
    data.vote = cmt.commentVote;
    data.revisionCount = cmt.commentRevisionCount;
    data.timeAgo = cmt.timeAgo;
    data.originalId = cmt.commentOriginalCommentId;
    if (cmt.sysMetal) data.sysMetal = cmt.sysMetal;
    data.goodCnt = cmt.commentGoodCnt;
    data.visible = cmt.commentVisible;
    data.articleId = cmt.commentOnArticleId;
    data.rewardedCnt = cmt.rewardedCnt;
    data.sharpURL = cmt.commentSharpURL;
    data.isAnonymous = cmt.commentAnonymous;
    data.replyCnt = cmt.commentReplyCnt;
    data.oId = cmt.oId;
    data.content = cmt.commentContent;
    data.status = cmt.commentStatus;
    if (cmt.commenter) data.commenter = Author.from(cmt.commenter);
    data.authorName = cmt.commentAuthorName;
    data.thankCnt = cmt.commentThankCnt;
    data.badCnt = cmt.commentBadCnt;
    data.rewarded = cmt.rewarded;
    data.authorThumbnailURL = cmt.commentAuthorThumbnailURL;
    data.audioURL = cmt.commentAudioURL;
    data.isOffered = cmt.commentQnAOffered == 1;
    return data;
  }
}

/**
 * 文章列表
 */
export class ArticleList {
  /**
   * 文章列表
   */
  articles: ArticleDetail[] = [];
  /**
   * 分页信息
   */
  pagination: Pagination = new Pagination();
  /**
   * 标签信息，仅查询标签下文章列表有效
   */
  tag?: ArticleTag;

  static from(list: Record<string, any>) {
    const data = new ArticleList();
    data.articles = list.articles.map((a: any) => ArticleDetail.from(a));
    data.pagination = Pagination.from(list.pagination);
    if (list.tag) data.tag = ArticleTag.from(list.tag);
    return data;
  }
}

export interface ICommentPost {
  /**
   * 文章 Id
   */
  articleId: string;
  /**
   * 是否匿名评论
   */
  isAnonymous?: boolean;
  /**
   * 评论是否楼主可见
   */
  isVisible?: boolean;
  /**
   * 评论内容
   */
  content: string;
  /**
   * 回复评论 Id
   */
  originalId?: string;
}
