/**
 * 用户信息
 */
declare interface IUserInfo {
    /**
     * 用户 id
     */
    oId: string;
    /**
     * 用户编号
     */
    userNo: string;
    /**
     * 用户名
     */
    userName: string;
    /**
     * 昵称
     */
    userNickname: string;
    /**
     * 首页地址
     */
    userURL: string;
    /**
     * 所在城市
     */
    userCity: string;
    /**
     * 签名
     */
    userIntro: string;
    /**
     * 是否在线
     */
    userOnlineFlag: boolean;
    /**
     * 用户积分
     */
    userPoint: number;
    /**
     * 用户组
     */
    userRole: string;
    /**
     * 角色
     */
    userAppRole: UserAppRole;
    /**
     * 用户头像地址
     */
    userAvatarURL: string;
    /**
     * 用户卡片背景
     */
    cardBg: string;
    /**
     * 用户关注数
     */
    followingUserCount: number;
    /**
     * 用户被关注数
     */
    followerCount: number;
    /**
     * 在线时长，单位分钟
     */
    onlineMinute: number;
    /**
     * 是否已经关注，未登录则为 `hide`
     */
    canFollow: 'hide' | 'no' | 'yes';
    /**
     * 用户所有勋章列表，包含未佩戴
     */
    allMetalOwned: MetalList;

    /**
     * 用户勋章列表
     */
    sysMetal: MetalList;
}

/**
 * 徽章属性
 */
declare interface IMetalAttr {
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
declare interface IMetalBase {
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
declare interface IMetal extends IMetalBase {
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

declare enum ClientType {
    /**
     * 网页端
     */
    Web = 'Web',
    /**
     * PC 端
     */
    PC = 'PC',
    /**
     * 移动端聊天室
     */
    Mobile = 'Mobile',
    /**
     * Windows 客户端
     */
    Windows = 'Windows',
    /**
     * macOS 客户端
     */
    macOS = 'macOS',
    /**
     * iOS 客户端
     */
    iOS = 'iOS',
    /**
     * Android 客户端
     */
    Android = 'Android',
    /**
     * IDEA 插件
     */
    IDEA = 'IDEA',
    /**
     * Chrome 插件
     */
    Chrome = 'Chrome',
    /**
     * Edge 插件
     */
    Edge = 'Edge',
    /**
     * VSCode 插件
     */
    VSCode = 'VSCode',
    /**
     * Python 插件
     */
    Python = 'Python',
    /**
     * Golang 插件
     */
    Golang = 'Golang',
    /**
     * 小冰机器人
     */
    IceNet = 'IceNet',
    /**
     * 凌机器人
     */
    ElvesOnline = 'ElvesOnline',
    /**
     * 其他插件
     */
    Other = 'Other',
}

declare interface IAtUser {
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
