/**
 * 清风明月内容
 */
export interface IBreezemoonContent {
  /**
   * 发布者用户名
   */
  breezemoonAuthorName: string;
  /**
   * 最后更新时间
   */
  breezemoonUpdated: string;
  /**
   * 清风明月ID
   */
  oId: string;
  /**
   * 创建时间
   */
  breezemoonCreated: string;
  /**
   * 发布者头像URL
   */
  breezemoonAuthorThumbnailURL48: string;
  /**
   * 发布时间
   */
  timeAgo: string;
  /**
   * 正文
   */
  breezemoonContent: string;
  /**
   * 创建时间
   */
  breezemoonCreateTime: string;
  /**
   * 发布城市（可能为空，请注意做判断）
   */
  breezemoonCity: string;
}
