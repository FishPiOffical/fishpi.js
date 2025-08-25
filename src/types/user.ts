import { domain } from "../utils";

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
    userURL: string = '';
    /**
     * 所在城市
     */
    userCity: string = '';
    /**
     * 签名
     */
    userIntro: string = '';
    /**
     * 是否在线
     */
    userOnlineFlag: boolean = false;
    /**
     * 用户积分
     */
    userPoint: number = 0;
    /**
     * 用户组
     */
    userRole: string = '';
    /**
     * 角色
     */
    userAppRole: UserAppRole = UserAppRole.Hack;
    /**
     * 用户头像地址
     */
    userAvatarURL: string = '';
    /**
     * 用户卡片背景
     */
    cardBg: string = '';
    /**
     * 用户关注数
     */
    followingUserCount: number = 0;
    /**
     * 用户被关注数
     */
    followerCount: number = 0;
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
    allMetalOwned: Metal[] = [];

    /**
     * 用户勋章列表
     */
    sysMetal: Metal[] = [];
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

    toString() {
        return `url=${this.url}&backcolor=${this.backcolor}&fontcolor=${this.fontcolor}`;
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
        if (!metal) { return; }
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
