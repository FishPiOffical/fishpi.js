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
 * VIP 信息
 */
export interface IUserVIP {
  /**
   * VIP Id
   */
  oId: string;
  /**
   * VIP 状态
   */
  state: number;
  /**
   * 用户 Id
   */
  userId: string;
  /**
   * 是否 VIP
   */
  jointVip: boolean;
  /**
   * 颜色
   */
  color: string;
  /**
   * 是否有下划线
   */
  underline: boolean;
  /**
   * 是否有金属质感
   */
  metal: boolean;
  /**
   * 是否自动签到
   */
  autoCheckin: number;
  /**
   * 是否加粗
   */
  bold: boolean;
  /**
   * 等级代码
   */
  lvCode: string;
  /**
   * 过期时间
   */
  expiresAt: number;
  /**
   * 创建时间
   */
  createdAt: number;
  /**
   * 更新时间
   */
  updatedAt: number;
}

export class UserVIP implements IUserVIP {
  /**
   * VIP Id
   */
  oId: string = '';
  /**
   * VIP 状态
   */
  state: number = 0;
  /**
   * 用户 Id
   */
  userId: string = '';
  /**
   * 是否 VIP
   */
  jointVip: boolean = false;
  /**
   * 颜色
   */
  color: string = '';
  /**
   * 是否有下划线
   */
  underline: boolean = false;
  /**
   * 是否有金属质感
   */
  metal: boolean = false;
  /**
   * 是否自动签到
   */
  autoCheckin: number = 0;
  /**
   * 是否加粗
   */
  bold: boolean = false;
  /**
   * 等级代码
   */
  lvCode: string = '';
  /**
   * 过期时间
   */
  expiresAt: number = 0;
  /**
   * 创建时间
   */
  createdAt: number = 0;
  /**
   * 更新时间
   */
  updatedAt: number = 0;

  get isVip(): boolean {
    return this.state === 1 && this.expiresAt * 1000 >= Date.now();
  }

  get vipName(): string {
    if (!this.isVip) return '非会员';
    return this.lvCode.replace(/_YEAR/, '(包年)').replace(/_MONTH/, '(包月)');
  }

  get expireDate(): Date {
    return new Date(this.expiresAt);
  }

  get createDate(): Date {
    return new Date(this.createdAt);
  }

  get updateDate(): Date {
    return new Date(this.updatedAt);
  }

  static from(data: any): UserVIP {
    const vip = new UserVIP();
    vip.oId = data.oId || '';
    vip.state = data.state || 0;
    vip.userId = data.userId || '';
    vip.jointVip = data.config?.jointVip || false;
    vip.color = data.config?.color || '';
    vip.underline = data.config?.underline || false;
    vip.metal = data.config?.metal || false;
    vip.autoCheckin = data.config?.autoCheckin || 0;
    vip.bold = data.config?.bold || false;
    vip.lvCode = data.lvCode || '';
    vip.expiresAt = data.expiresAt || 0;
    vip.createdAt = data.createdAt || 0;
    vip.updatedAt = data.updatedAt || 0;
    return vip;
  }
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

export class Pagination {
  /**
   * 分页数
   */
  pageCount = 0;
  /**
   * 建议分页页码
   */
  pageNums: number[] = [];

  static from(data: any) {
    const p = new Pagination();
    p.pageCount = data.paginationPageCount;
    p.pageNums = data.paginationPageNums;
    return p;
  }
}
