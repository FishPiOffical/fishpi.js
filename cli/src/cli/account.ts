import { Config } from './config';
import { Account, BaseCli, FishPi, UserInfo } from './lib';
import { input, password, confirm } from '@inquirer/prompts';
import { Terminal } from './terminal';

export class AccountCli extends BaseCli {
  me: UserInfo | undefined;
  currrentUser: string = '';

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.commands = [
      {
        commands: ['user', 'u'],
        description: '查看个人信息，示例：u imlinhanchao',
        call: this.load.bind(this),
      },
      {
        commands: ['A'],
        description: '查看用户文章，示例：A imlinhanchao',
        call: (...args: any[]) =>
          this.terminal.emit('cmd', 'article ' + (args.join(' ') || this.currrentUser)),
      },
      {
        commands: ['B'],
        description: '查看用户清风明月，示例：B imlinhanchao',
        call: (...args: any[]) =>
          this.terminal.emit('cmd', 'breezemoon ' + (args.join(' ') || this.currrentUser)),
      },
    ];
  }

  async isLogin() {
    const token = Config.get('token');
    if (!token) return false;

    this.fishpi.setToken(token);
    const info: UserInfo | false = await this.fishpi.account.info().catch(() => false);
    if (info) {
      this.me = info;
      Config.set('username', info.userName);
    }

    return info != false;
  }

  async login() {
    const account = new Account();
    const username = Config.get('username');
    account.username = await input({ message: '用户名', default: username });
    account.passwd = await password({ message: '密码' });
    if (await confirm({ message: '是否有二次验证码？', default: false })) {
      account.mfaCode = await input({ message: '请输入二次验证码' });
    }
    const token = await this.fishpi.login(account);
    if (!token) return false;
    this.me = await this.fishpi.account.info();
    Config.set('token', token);
    Config.set('username', this.me.userName);
    return true;
  }

  async load(user: string = '') {
    super.load();
    this.render(user);
    this.terminal.setTip(
      'u - 查看用户，A - 查看用户文章， B - 查看用户清风明月，help - 帮助，exit - 退出',
    );
  }

  async unload() {
    super.unload();
  }

  async render(user: string) {
    let info = this.me?.userName === user || !user ? this.me : await this.fishpi.user(user);
    if (!info) {
      this.log(this.terminal.red.raw('[错误] 用户 ' + user + ' 不存在.'));
      return;
    }

    this.currrentUser = info.userName;
    const username = info.userNickname ? `${info.userNickname}(${info.userName})` : info.userName;
    this.terminal.clear();
    this.log(
      this.terminal.Bold.blue.raw(username),
      ' - ',
      info.online ? this.terminal.green.raw('[在线]') : this.terminal.red.raw('[离线]'),
    );
    this.log(
      '👤 ',
      ['黑客', '画家'][info.appRole],
      '\t',
      this.terminal.Bold.cyan.text(`No.${info.userNo}`),
    );
    this.log(`💲${info.points}\t${!info.city ? '' : `📍${info.city}`}`);
    if (info.intro) this.log(`📝 ${info.intro}`);
    if (info.URL) this.log('🔗 ', this.terminal.Bold.Underline.text(`${info.URL}`));

    let metals = '';
    const maxLength = Math.max(3, ...info.sysMetal.map((s) => s.name.length));
    const size = Math.floor(this.terminal.info.width / (maxLength + 8)) - 1;
    for (var i = 0; i < info.sysMetal.length; i++) {
      metals += `🏅 ${info.sysMetal[i].name.padEnd(maxLength)}\t`;
      if ((i + 1) % size == 0) metals += '\n';
    }
    if (info.sysMetal.length > 0) {
      this.log('🏅 勋章');
      this.log(this.terminal.yellow.text(metals));
    }

    this.log('');

    if (info.userName == this.me?.userName) {
      this.log(
        this.terminal.yellow.text('当前活跃度'),
        ': ',
        this.terminal.Bold.cyan.raw(`${await this.fishpi.account.liveness()}`),
      );
    }
  }
}
