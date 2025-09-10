import { DataType, IArticleTag } from '.';

/**
 * 通知类型
 */
export enum NoticeType {
  /**
   * 积分
   */
  Point = 'point',
  /**
   * 评论
   */
  Comment = 'commented',
  /**
   * 回复
   */
  Reply = 'reply',
  /**
   * 提及我的
   */
  At = 'at',
  /**
   * 我关注的
   */
  Following = 'following',
  /**
   * 同城
   */
  Broadcast = 'broadcast',
  /**
   * 系统
   */
  System = 'sys-announce',
}

/**
 * 通知列表
 */
export type NoticeList = Array<
  INoticePoint | INoticeComment | INoticeReply | INoticeAt | INoticeArticle | INoticeSystem
>;

/**
 * 通知数
 */
export interface INoticeCount {
  /**
   * 用户是否启用 Web 通知
   */
  userNotifyStatus: boolean;
  /**
   * 未读通知数
   */
  unreadNotificationCnt: number;
  /**
   * 未读回复通知数
   */
  unreadReplyNotificationCnt: number;
  /**
   * 未读积分通知数
   */
  unreadPointNotificationCnt: number;
  /**
   * 未读 @ 通知数
   */
  unreadAtNotificationCnt: number;
  /**
   * 未读同城通知数
   */
  unreadBroadcastNotificationCnt: number;
  /**
   * 未读系统通知数
   */
  unreadSysAnnounceNotificationCnt: number;
  /**
   * 未读关注者通知数
   */
  unreadNewFollowerNotificationCnt: number;
  /**
   * 未读关注通知数
   */
  unreadFollowingNotificationCnt: number;
  /**
   * 未读评论通知数
   */
  unreadCommentedNotificationCnt: number;
}

/**
 * 积分通知
 */
export interface INoticePoint {
  /**
   * 通知 id
   */
  oId: string;
  /**
   * 数据 id
   */
  dataId: string;
  /**
   * 用户 id
   */
  userId: string;
  /**
   * 数据类型
   */
  dataType: DataType;
  /**
   * 通知描述
   */
  description: string;
  /**
   * 是否已读
   */
  hasRead: boolean;
  /**
   * 创建日期
   */
  createTime: string;
}

/**
 * 评论通知
 */
export interface INoticeComment {
  /**
   * 通知 id
   */
  oId: string;
  /**
   * 文章标题
   */
  commentArticleTitle: string;
  /**
   * 文章作者
   */
  commentAuthorName: string;
  /**
   * 作者头像
   */
  commentAuthorThumbnailURL: string;
  /**
   * 文章类型
   */
  commentArticleType: number;
  /**
   * 是否精选
   */
  commentArticlePerfect: number;
  /**
   * 评论内容
   */
  commentContent: string;
  /**
   * 评论地址
   */
  commentSharpURL: string;
  /**
   * 是否已读
   */
  hasRead: boolean;
  /**
   * 评论时间
   */
  commentCreateTime: string;
}

/**
 * 回帖通知
 */
export interface INoticeReply extends INoticeComment {
  /**
   * 文章 id
   */
  articleId: string;
  /**
   * 数据类型
   */
  dataType: DataType;
}

/**
 * 提到我通知
 */
export interface INoticeAt {
  /**
   * 通知 id
   */
  oId: string;
  /**
   * 数据 id
   */
  dataId: string;
  /**
   * 数据类型
   */
  dataType: DataType;
  /**
   * 用户名
   */
  userName: string;
  /**
   * 用户头像
   */
  thumbnailURL: string;
  /**
   * 通知内容
   */
  description: string;
  /**
   * 是否已读
   */
  hasRead: boolean;
  /**
   * 创建时间
   */
  createTime: string;
}

/**
 * 我关注的通知
 */
export interface INoticeArticle {
  /**
   * 通知 Id
   */
  oId: string;
  /**
   * 文章地址
   */
  url: string;
  /**
   * 数据类型
   */
  dataType: DataType;
  /**
   * 文章标题
   */
  articleTitle: string;
  /**
   * 作者
   */
  authorName: string;
  /**
   * 通知内容
   */
  content: string;
  /**
   * 是否评论
   */
  isComment: boolean;
  /**
   * 作者头像
   */
  thumbnailURL: string;
  /**
   * 文章评论数
   */
  articleCommentCount: number;
  /**
   * 是否精选
   */
  articlePerfect: number;
  /**
   * 文章标签列表
   */
  articleTagObjs: IArticleTag[];
  /**
   * 文章标签
   */
  articleTags: string;
  /**
   * 文章类型
   */
  articleType: number;
  /**
   * 是否已读
   */
  hasRead: boolean;
  /**
   * 通知创建时间
   */
  createTime: string;
}

/**
 * 系统通知数据
 */
export interface INoticeSystem {
  /**
   * 消息的 oId
   */
  oId: string;
  /**
   * 用户 Id
   */
  userId: string;
  /**
   * 数据 Id
   */
  dataId: string;
  /**
   * 数据类型
   */
  dataType: DataType;
  /**
   * 消息描述
   */
  description: string;
  /**
   * 是否已读
   */
  hasRead: boolean;
  /**
   * 创建日期
   */
  createTime: string;
}

export enum NoticeCommandType {
  /** 刷新通知 */
  RefreshNotification = 'refreshNotification',
  /**
   * 聊天未读数刷新
   */
  ChatUnreadCountRefresh = 'chatUnreadCountRefresh',
  /**
   * 新的闲聊消息
   */
  NewIdleChatMessage = 'newIdleChatMessage',
  /**
   * 系统广播警告
   */
  WarnBroadcast = 'warnBroadcast',
  /**
   * 清风明月更新
   */
  bzUpdate = 'bzUpdate',
}

/**
 * 通知消息
 */
export interface INoticeCommand {
  /**
   * 通知类型
   */
  command: NoticeCommandType;
}

/**
 * 未读消息数
 */
export interface INoticeUnReadCount extends INoticeCommand {
  /**
   * 未读数
   */
  count: number;
}

/**
 * 私聊通知
 */
export interface INoticeIdleChat extends INoticeCommand {
  senderUserName: string;
  senderAvatar: string;
  preview: string;
}

/**
 * 系统广播
 */
export interface INoticeWarnBroadcast extends INoticeCommand {
  warnBroadcastText: string;
  who: string;
}

/**
 * 清风明月更新
 */
export interface INoticeBreezemoon extends INoticeCommand {
  /**
   * 发布者用户名
   */
  breezemoonAuthorName: string;
  /**
   * 发布者头像
   */
  breezemoonAuthorThumbnailURL48: string;
  /**
   * 内容
   */
  breezemoonContent: string;
  /**
   * 清风明月ID
   */
  oId: string;
}
