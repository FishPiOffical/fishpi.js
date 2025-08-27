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
  INoticePoint | INoticeComment | INoticeAt | INoticeFollow | INoticeSystem
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
 * 评论/回帖通知
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
 * 提到我通知
 */
export interface INoticeAt {
  /**
   * 通知 id
   */
  oId: string;
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
  userAvatarURL: string;
  /**
   * 通知内容
   */
  content: string;
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
export interface INoticeFollow {
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

/**
 * 通知消息
 */
export interface INoticeMsg {
  /**
   * 通知类型
   */
  command:
    | 'refreshNotification'
    | 'chatUnreadCountRefresh'
    | 'newIdleChatMessage'
    | 'warnBroadcast';
  /*
   * 通知接收者用户Id
   */
  userId: string;
  /**
   * 私聊内容预览，仅 `newIdleChatMessage` 有信息
   */
  preview?: string;
  /**
   * 私聊发送者头像，仅 `refreshNotification` 有信息
   */
  senderAvatar?: string;
  /**
   * 私聊发送者用户名，仅 `refreshNotification` 有信息
   */
  senderUserName?: string;
  /**
   * 私聊消息数，仅 `chatUnreadCountRefresh` 有信息
   */
  count?: number;
  /**
   * 全局公告内容，仅 `warnBroadcast` 有信息
   */
  warnBroadcastText?: string;
  /**
   * 全局公告发布者，仅 `warnBroadcast` 有信息
   */
  who?: string;
}
