import { Pagination } from '.';

/**
 * 清风明月内容
 */
export class BreezemoonContent {
  /**
   * 发布者用户名
   */
  authorName: string = '';
  /**
   * 最后更新时间
   */
  updatedAt: string = '';
  /**
   * 清风明月ID
   */
  oId: string = '';
  /**
   * 创建时间
   */
  createAt: string = '';
  /**
   * 发布者头像URL
   */
  authorThumbnail: string = '';
  /**
   * 发布时间
   */
  timeAgo: string = '';
  /**
   * 正文
   */
  content: string = '';
  /**
   * 发布城市（可能为空，请注意做判断）
   */
  city: string = '';

  static from(src: Record<string, any>): BreezemoonContent {
    const data = new BreezemoonContent();
    data.authorName = src.breezemoonAuthorName;
    data.updatedAt = src.breezemoonUpdated;
    data.oId = src.oId;
    data.createAt = src.breezemoonCreated;
    data.authorThumbnail = src.breezemoonAuthorThumbnailURL48;
    data.timeAgo = src.timeAgo;
    data.content = src.breezemoonContent;
    data.city = src.breezemoonCity;
    return data;
  }
}

export class BreezemoonList {
  /**
   * 分页信息
   */
  pagination: Pagination = new Pagination();
  /**
   * 清风明月列表
   */
  breezemoons: BreezemoonContent[] = [];

  static from(src: Record<string, any>): BreezemoonList {
    const data = new BreezemoonList();
    data.pagination = src.pagination;
    data.breezemoons = src.breezemoons.map((b: any) => BreezemoonContent.from(b));
    return data;
  }
}
