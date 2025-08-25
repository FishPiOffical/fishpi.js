export * from "./article";
export * from "./chatroom";
export * from "./chat";
export * from "./redpacket";
export * from "./user";
export * from "./finger";

/**
 * 登录信息
 */
export class Account implements IAccount {
  /**
   * 用户名
   */
  username: string = "";
  /**
   * 密码
   */
  passwd: string = "";
  /**
   * 二次验证码，非必填
   */
  mfaCode?: string = "";
}

/**
 * 注册信息
 */
export class PreRegisterInfo implements IPreRegisterInfo {
  /**
   * 用户名
   */
  username: string = "";
  /**
   * 手机号
   */
  phone: string = "";
  /**
   * 邀请码
   */
  invitecode?: string;
  /**
   * 验证码
   */
  captcha: string = "";
}

/**
 * 注册信息
 */
export class RegisterInfo implements IRegisterInfo {
  /**
   * 用户角色
   */
  role: string = "";
  /**
   * 用户密码
   */
  passwd: string = "";
  /**
   * 用户 Id
   */
  userId: string = "";
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
  reportDataId: string = "";
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
  reportMemo: string = "";
}
