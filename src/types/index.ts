export * from './article';
export * from './breezemoon';
export * from './chat';
export * from './chatroom';
export * from './redpacket';
export * from './user';
export * from './finger';
export * from './notice';

/**
 * 数据类型
 */
export enum DataType {
  /**
   * 文章
   */
  article = 0,

  /**
   * 评论
   */
  comment = 1,

  /**
   * @
   */
  at = 2,

  /**
   * 被评论
   */
  commented = 3,

  /**
   * 关注者
   */
  followingUser = 4,

  /**
   * 积分 - 充值
   */
  pointCharge = 5,

  /**
   * 积分 - 转账
   */
  pointTransfer = 6,

  /**
   * 积分 - 文章打赏
   */
  pointArticleReward = 7,

  /**
   * 积分 - 评论感谢
   */
  pointCommentThank = 8,

  /**
   * 同城广播
   */
  broadcast = 9,

  /**
   * 积分 - 交易
   */
  pointExchange = 10,

  /**
   * 积分 - 滥用扣除
   */
  abusePointDeduct = 11,

  /**
   * 积分 - 文章被感谢
   */
  pointArticleThank = 12,

  /**
   * 回复
   */
  reply = 13,

  /**
   * 使用邀请码
   */
  invitecodeUsed = 14,

  /**
   * 系统公告 - 文章
   */
  sysAnnounceArticle = 15,

  /**
   * 系统公告 - 新用户
   */
  sysAnnounceNewUser = 16,

  /**
   * 新的关注者
   */
  newFollower = 17,

  /**
   * 邀请链接
   */
  invitationLinkUsed = 18,

  /**
   * 系统通知 - 角色变化
   */
  sysAnnounceRoleChanged = 19,

  /**
   * 关注的文章更新
   */
  followingArticleUpdate = 20,

  /**
   * 关注的文章评论
   */
  followingArticleComment = 21,

  /**
   * 积分 - 文章优选
   */
  pointPerfectArticle = 22,

  /**
   * 文章新的被关注者
   */
  articleNewFollower = 23,

  /**
   * 文章新的关注者
   */
  articleNewWatcher = 24,

  /**
   * 评论点赞
   */
  commentVoteUp = 25,

  /**
   * 评论点踩
   */
  commentVoteDown = 26,

  /**
   * 文章被点赞
   */
  articleVoteUp = 27,

  /**
   * 文章被点踩
   */
  articleVoteDown = 28,

  /**
   * 积分 - 评论被接受
   */
  pointCommentAccept = 33,

  /**
   * 积分 - 举报处理
   */
  pointReportHandled = 36,

  /**
   * 聊天室 @
   */
  chatRoomAt = 38,

  /**
   * 专属红包提醒
   */
  redPacket = 39,
}

/**
 * 用户角色类型
 */
export enum UserAppRole {
  /**
   * 黑客
   */
  Hack = 0,
  /**
   * 画家
   */
  Artist = 1,
}

/**
 * 举报数据类型
 */
export enum ReportDataType {
  /**
   * 文章
   */
  article = 0,
  /**
   * 评论
   */
  comment = 1,
  /**
   * 用户
   */
  user = 2,
  /**
   * 聊天消息
   */
  chatroom = 3,
}

/**
 * 举报类型
 */
export enum ReportType {
  /**
   * 垃圾广告
   */
  advertise = 0,
  /**
   * 色情
   */
  porn = 1,
  /**
   * 违规
   */
  violate = 2,
  /**
   * 侵权
   */
  infringement = 3,
  /**
   * 人身攻击
   */
  attacks = 4,
  /**
   * 冒充他人账号
   */
  impersonate = 5,
  /**
   * 垃圾广告账号
   */
  advertisingAccount = 6,
  /**
   * 违规泄露个人信息
   */
  leakPrivacy = 7,
  /**
   * 其它
   */
  other = 8,
}

/**
 * 登录信息
 */
export class Account implements IAccount {
  /**
   * 用户名
   */
  username: string = '';
  /**
   * 密码
   */
  passwd: string = '';
  /**
   * 二次验证码，非必填
   */
  mfaCode?: string = '';
}

/**
 * 注册信息
 */
export class PreRegisterInfo implements IPreRegisterInfo {
  /**
   * 用户名
   */
  username: string = '';
  /**
   * 手机号
   */
  phone: string = '';
  /**
   * 邀请码
   */
  invitecode?: string;
  /**
   * 验证码
   */
  captcha: string = '';
}

/**
 * 注册信息
 */
export class RegisterInfo implements IRegisterInfo {
  /**
   * 用户角色
   */
  role: string = '';
  /**
   * 用户密码
   */
  passwd: string = '';
  /**
   * 用户 Id
   */
  userId: string = '';
  /**
   * 邀请人用户名
   */
  r?: string;
}

/**
 * 举报接口数据
 */
export class Report implements IReport {
  /**
   * 举报对象的 oId
   */
  reportDataId: string = '';
  /**
   * 举报数据的类型
   */
  reportDataType: ReportDataType = ReportDataType.article;
  /**
   * 举报的类型
   */
  reportType: ReportType = ReportType.advertise;
  /**
   * 举报的理由
   */
  reportMemo: string = '';
}

/**
 * 登录信息
 */
export interface IAccount {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  passwd: string;
  /**
   * 二次验证码，非必填
   */
  mfaCode?: string;
}

/**
 * 注册信息
 */
export interface IPreRegisterInfo {
  /**
   * 用户名
   */
  username: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 邀请码
   */
  invitecode?: string;
  /**
   * 验证码
   */
  captcha: string;
}

/**
 * 注册信息
 */
export interface IRegisterInfo {
  /**
   * 用户角色
   */
  role: string;
  /**
   * 用户密码
   */
  passwd: string;
  /**
   * 用户 Id
   */
  userId: string;
  /**
   * 邀请人用户名
   */
  r?: string;
}

/**
 * 上传文件响应
 */
export interface IUploadInfo {
  /**
   * 上传失败文件
   */
  errFiles: string[];
  /**
   * 上传成功文件
   */
  succMap: {
    /**
     * Key 是文件名，value 为地址
     */
    [key: string]: string;
  };
}

/**
 * 举报接口数据
 */
export interface IReport {
  /**
   * 举报对象的 oId
   */
  reportDataId: string;
  /**
   * 举报数据的类型
   */
  reportDataType: ReportDataType;
  /**
   * 举报的类型
   */
  reportType: ReportType;
  /**
   * 举报的理由
   */
  reportMemo: string;
}

/**
 * 禁言用户信息
 */
export interface IMuteItem {
  /**
   * 解除禁言时间戳
   */
  time: number;
  /**
   * 用户头像
   */
  userAvatarURL: string;
  /**
   * 用户名
   */
  userName: string;
  /**
   * 用户昵称
   */
  userNickname: string;
}

export interface ILog {
  /**
   * 操作时间
   */
  key1: string;
  /**
   * IP
   */
  key2: string;
  /**
   * 内容
   */
  data: string;
  /**
   * 是否公开
   */
  public: boolean;
  /**
   * 操作类型
   */
  key3: string;
  /**
   * 唯一标识
   */
  oId: string;
  /**
   * 类型
   */
  type: string;
}
