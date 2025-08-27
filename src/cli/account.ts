import { Config } from './config';
import { Account, BaseCli, FishPi, UserInfo } from './lib';
import { input, password, confirm } from '@inquirer/prompts';
import { Terminal } from './terminal';

export class AccountCli extends BaseCli {
  me: UserInfo | undefined;

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal)
  }

  async isLogin() {
    const token = Config.get('token');
    if (!token) return false;

    this.fishpi.setToken(token);
    const info: UserInfo | false = await this.fishpi.account.info().catch(() => false);
    if (info) this.me = info;

    return info != false;
  }

  async login() {
    const account = new Account();
    account.username = await input({ message: '用户名' });
    account.passwd = await password({ message: '密码' });
    if (await confirm({ message: '是否有二次验证码？', default: false })) {
      account.mfaCode = await input({ message: '请输入二次验证码' });
    }
    const token = await this.fishpi.login(account).catch((e) => {
      console.error('登录失败：', e.message);
    });
    if (!token) return false;
    Config.set('token', token);
    return true;
  }
}
