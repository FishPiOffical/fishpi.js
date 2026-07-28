/**
 * 表情分组的信息
 */
export interface IEmojiGroup {
  /**
   * 分组名称
   */
  name: string;
  /**
   * 分组 ID
   */
  oId: string;
  /**
   * 分组排序
   */
  sort: number;
  /**
   * 分组类型，0：自定义分组，1：全部
   */
  type: number;
}

/**
 * 表情的分组信息 
 */
export interface IEmojiGroupInfo {
  /**
   * 分组 ID
   */
  groupId: string;
  /**
   * 表情 ID
   */
  emojiId: string;
  /**
   * 表情排序
   */
  sort: number;
  /**
   * 表情名称
   */
  name: string;
}

/**
 * 表情的详细信息
 */
export interface IEmojiInfo {
  /**
   * 表情 ID
   */
  emojiId: string;
  /**
   * 表情名称
   */
  name: string;
  /**
   * 数据ID
   */
  oId: string;
  /**
   * 表情排序
   */
  sort: number;
  /**
   * 表情 URL
   */
  url: string;
}