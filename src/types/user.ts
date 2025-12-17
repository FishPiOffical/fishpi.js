import { UserAppRole } from '.';
import { domain, toMetal } from '../utils';

export interface IUserLite {
  oId: string;
  userAvatarURL: string;
  userNickname: string;
  userName: string;
}

/**
 * 用户信息
 */
export class UserInfo {
  /**
   * 用户 id
   */
  oId: string = '';
  /**
   * 用户编号
   */
  userNo: string = '';
  /**
   * 用户名
   */
  userName: string = '';
  /**
   * 昵称
   */
  userNickname: string = '';
  /**
   * 首页地址
   */
  URL: string = '';
  /**
   * 所在城市
   */
  city: string = '';
  /**
   * 签名
   */
  intro: string = '';
  /**
   * 是否在线
   */
  online: boolean = false;
  /**
   * 用户积分
   */
  points: number = 0;
  /**
   * 用户组
   */
  role: string = '';
  /**
   * 角色
   */
  appRole: UserAppRole = UserAppRole.Hack;
  /**
   * 用户头像地址
   */
  avatar: string = '';
  /**
   * 用户卡片背景
   */
  cardBg: string = '';
  /**
   * 用户关注数
   */
  following: number = 0;
  /**
   * 用户被关注数
   */
  follower: number = 0;
  /**
   * 在线时长，单位分钟
   */
  onlineMinute: number = 0;
  /**
   * 是否已经关注，未登录则为 `hide`
   */
  canFollow: 'hide' | 'no' | 'yes' = 'hide';
  /**
   * 用户所有勋章列表，包含未佩戴
   */
  ownedMetal: Metal[] = [];

  /**
   * 用户勋章列表
   */
  sysMetal: Metal[] = [];
  /**
   * MBTI 性格类型
   */
  mbti: string = '';

  get name(): string {
    return this.userNickname ? `${this.userNickname}(${this.userName})` : this.userName;
  }

  static from(user: Record<string, any>) {
    const data = new UserInfo();
    data.oId = user.oId;
    data.userNo = user.userNo;
    data.userName = user.userName;
    data.userNickname = user.userNickname;
    data.URL = user.userURL;
    data.city = user.userCity;
    data.intro = user.userIntro;
    data.online = user.userOnlineFlag;
    data.points = user.userPoint;
    data.role = user.userRole;
    data.appRole = user.userAppRole;
    data.avatar = user.userAvatarURL;
    data.cardBg = user.cardBg;
    data.following = user.followingUserCount;
    data.follower = user.followerCount;
    data.onlineMinute = user.onlineMinute;
    data.canFollow = user.canFollow;
    data.ownedMetal = toMetal(user.allMetalOwned);
    data.sysMetal = toMetal(user.sysMetal);
    data.mbti = user.mbti;

    return data;
  }
}

/**
 * 徽章属性
 */
export class MetalAttr {
  /**
   * 徽标图地址
   */
  url: string = '';
  /**
   * 背景色
   */
  backcolor: string = '';
  /**
   * 文字颜色
   */
  fontcolor: string = '';
  /**
   * 版本号
   */
  ver: number = 0.1;
  /**
   * 缩放比例
   */
  scale: number = 0.79;

  toString() {
    return `url=${this.url}&backcolor=${this.backcolor}&fontcolor=${this.fontcolor}&ver=${this.ver}&scale=${this.scale}`;
  }
}

/**
 * 徽章基本信息
 */
export class MetalBase {
  /**
   * 徽章属性
   */
  attr: MetalAttr | string = new MetalAttr();
  /**
   * 徽章名
   */
  name: string = '';
  /**
   * 徽章描述
   */
  description: string = '';
  /**
   * 徽章数据
   */
  data: string = '';

  constructor(metal?: MetalBase) {
    if (!metal) {
      return;
    }
    this.attr = Object.assign(new MetalAttr(), metal.attr);
    this.name = metal.name;
    this.description = metal.description;
    this.data = metal.data;
  }

  toUrl(includeText: boolean = true) {
    let url = `https://${domain}/gen?txt=${this.name}&${this.attr.toString()}`;
    if (!includeText) {
      url = `https://${domain}/gen?txt=&${this.attr.toString()}`;
    }
    return url;
  }
}

/**
 * 徽章信息
 */
export class Metal extends MetalBase {
  /**
   * 完整徽章地址（含文字）
   */
  url?: string;
  /**
   * 徽章地址（不含文字）
   */
  icon?: string;
  /**
   * 是否佩戴
   */
  enable: boolean = true;
}

export class AtUser {
  /**
   * 用户名
   */
  userName: string = '';
  /**
   * 用户头像
   */
  userAvatarURL: string = '';
  /**
   * 全小写用户名
   */
  userNameLowerCase: string = '';
}

/**
 * 徽章属性
 */
export interface IMetalAttr {
  /**
   * 徽标图地址
   */
  url: string;
  /**
   * 背景色
   */
  backcolor: string;
  /**
   * 文字颜色
   */
  fontcolor: string;
}

/**
 * 徽章基本信息
 */
export interface IMetalBase {
  /**
   * 徽章属性
   */
  attr: IMetalAttr | string;
  /**
   * 徽章名
   */
  name: string;
  /**
   * 徽章描述
   */
  description: string;
  /**
   * 徽章数据
   */
  data: string;
}

/**
 * 徽章信息
 */
export interface IMetal extends IMetalBase {
  /**
   * 完整徽章地址（含文字）
   */
  url?: string;
  /**
   * 徽章地址（不含文字）
   */
  icon?: string;
  /**
   * 是否佩戴
   */
  enable: boolean;
}

export interface IAtUser {
  /**
   * 用户名
   */
  userName: string;
  /**
   * 用户头像
   */
  userAvatarURL: string;
  /**
   * 全小写用户名
   */
  userNameLowerCase: string;
}

/**
 * 更新用户信息参数
 */
export interface UserUpdateParams {
  /**
   * 昵称
   */
  userNickname?: string;
  /**
   * 用户标签，多个标签用逗号分隔
   */
  userTags?: string;
  /**
   * 个人主页 URL
   */
  userURL?: string;
  /**
   * 个人简介
   */
  userIntro?: string;
  /**
   * MBTI 性格类型（例如：ENFP）
   */
  mbti?: string;
}
