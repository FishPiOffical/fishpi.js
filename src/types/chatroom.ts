import { IMetal, IRedPacketMessage } from '.';

export enum ClientType {
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

/**
 * 聊天室消息来源
 */
export class ChatRoomSource implements IChatRoomSource {
  /**
   * 消息来源
   */
  client: ClientType | string = ClientType.Other;
  /**
   * 消息来源版本
   */
  version: string = 'latest';
}

/**
 * 历史消息类型
 */
export enum ChatContentType {
  /**
   * 原始 Markdown
   */
  Markdown = 'md',
  /**
   * 渲染 HTML
   */
  HTML = 'html',
}

/**
 * chatroom get 接口获取 oId 的相关消息类型
 */
export enum ChatMessageType {
  /**
   * 前后消息
   */
  Context = 0,
  /**
   * 前面的消息
   */
  Before = 1,
  /**
   * 后面的消息
   */
  After = 2,
}

/**
 * 聊天室消息类型
 */
export enum ChatRoomMessageType {
  /**
   * 在线用户
   */
  online = 'online',
  /**
   * 话题修改
   */
  discussChanged = 'discussChanged',
  /**
   * 消息撤回
   */
  revoke = 'revoke',
  /**
   * 消息
   */
  msg = 'msg',
  /**
   * 红包
   */
  redPacket = 'redPacket',
  /**
   * 红包状态
   */
  redPacketStatus = 'redPacketStatus',
  /**
   * 弹幕
   */
  barrager = 'barrager',
  /**
   * 自定义消息
   */
  custom = 'customMessage',
}
/**
 * 聊天室消息来源
 */
export interface IChatRoomSource {
  /**
   * 消息来源
   */
  client: ClientType | string;
  /**
   * 消息来源版本
   */
  version: string;
}

/**
 * 聊天室消息
 */
export interface IChatRoomMessage {
  /**
   * 消息 Id
   */
  oId: string;
  /**
   * 消息类型
   */
  type: string;
  /**
   * 发送者用户名
   */
  userName: string;
  /**
   * 用户昵称
   */
  userNickname: string;
  /**
   * 用户头像
   */
  userAvatarURL: string;
  /**
   * 用户徽章
   */
  sysMetal: IMetal[];
  /**
   * 消息来源
   */
  client: string;
  /**
   * 消息来源解析
   */
  via: IChatRoomSource;
  /**
   * 消息内容
   */
  content: string | IRedPacketMessage;
  /**
   * Markdown 内容
   */
  md: string;
  /**
   * 发送时间
   */
  time: string;
}

export type CustomMsg = string;

/**
 * 弹幕消息
 */
export interface IBarragerMsg {
  /**
   * 用户名
   */
  userName: string;
  /**
   * 用户昵称
   */
  userNickname: string;
  /**
   * 弹幕内容
   */
  barragerContent: string;
  /**
   * 弹幕颜色
   */
  barragerColor: string;
  /**
   * 用户头像地址
   */
  userAvatarURL: string;
  /**
   * 用户头像地址 20x20
   */
  userAvatarURL20: string;
  /**
   * 用户头像地址 48x48
   */
  userAvatarURL48: string;
  /**
   * 用户头像地址 210x210
   */
  userAvatarURL210: string;
}

/**
 * 在线用户信息
 */
export interface IOnlineInfo {
  /**
   * 用户首页
   */
  homePage: string;
  /**
   * 用户头像
   */
  userAvatarURL: string;
  /**
   * 用户名
   */
  userName: string;
}

/**
 * 主题修改消息，主题内容
 */
export type DiscussMsg = string;

/**
 * 撤回消息，被撤回消息的 oId
 */
export type RevokeMsg = string;

/**
 * 聊天消息
 */
export interface IChatRoomMsg<T = string> {
  /**
   * 消息类型
   */
  type: string;
  /**
   * 消息 oId
   */
  oId: string;
  /**
   * 消息发送时间
   */
  time: string;
  /**
   * 用户 Id
   */
  userOId: string;
  /**
   * 发送者用户名
   */
  userName: string;
  /**
   * 发送者昵称
   */
  userNickname: string;
  /**
   * 发送者头像
   */
  userAvatarURL: string;
  /**
   * 消息内容
   */
  content: T;
  /**
   * 消息内容 Markdown
   */
  md: string;
  /**
   * 消息来源
   */
  client: string;
  /**
   * 消息来源解析
   */
  via: IChatRoomSource;
}

type WeatherCode =
  | 'CLEAR_DAY'
  | 'CLEAR_NIGHT'
  | 'CLOUDY'
  | 'DUST'
  | 'FOG'
  | 'HEAVY_HAZE'
  | 'HEAVY_RAIN'
  | 'HEAVY_SNOW'
  | 'LIGHT_HAZE'
  | 'LIGHT_RAIN'
  | 'LIGHT_SNOW'
  | 'MODERATE_HAZE'
  | 'MODERATE_RAIN'
  | 'MODERATE_SNOW'
  | 'PARTLY_CLOUDY_DAY'
  | 'PARTLY_CLOUDY_NIGHT'
  | 'SAND'
  | 'STORM_RAIN'
  | 'STORM_SNOW'
  | 'WIND';

/**
 * 聊天天气消息详情
 */
export interface IChatWeatherData {
  /**
   * 日期
   */
  date: string;
  /**
   * 天气代码
   */
  code: WeatherCode;
  /**
   * 最小气温
   */
  min: number;
  /**
   * 最大气温
   */
  max: number;
}

/**
 * 聊天天气消息
 */
export interface IChatWeather {
  /**
   * 城市
   */
  city: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 最近几天天气数据
   */
  data: IChatWeatherData[];
}

/**
 * 聊天音乐消息
 */
export interface IChatMusic {
  type: 'music';
  /**
   * 音乐源
   */
  source: string;
  /**
   * 封面地址
   */
  coverURL: string;
  /**
   * 歌曲名称
   */
  title: string;
  /**
   * 来源
   */
  from: string;
}

/**
 * 聊天室节点信息
 */
export interface IChatRoomNode {
  /**
   * 节点地址
   */
  node: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 在线人数
   */
  online?: number;
}

/**
 * 聊天室节点详情
 */
export interface IChatRoomNodeInfo {
  /**
   * 推荐节点
   */
  recommend: IChatRoomNode;
  /**
   * 所有节点
   */
  avaliable: IChatRoomNode[];
}
