import { Config } from './config';
import { BaseCli, FishPi, BreezemoonContent } from './lib';
import { Terminal, TerminalInputMode } from './terminal';

export class BreezemoonCli extends BaseCli {
  me: string | undefined;
  eventFns: any = {};
  page: number = 1;
  user?: string;

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.commands = [
      {
        commands: ['breezemoon', 'b'],
        description: '查看清风明月，传递用户名可查看指定用户的清风明月，示例：b imlinhanchao',
        call: this.load.bind(this),
      },
      { commands: ['next', 'n'], description: '下一页清风明月', call: this.next.bind(this) },
      { commands: ['prev', 'p'], description: '上一页清风明月', call: this.prev.bind(this) },
      {
        commands: ['send', 's'],
        description: '发送清风明月，示例：s 今天天气真好！',
        call: this.send.bind(this),
      },
    ];
  }

  async load(user: string = '') {
    this.me = Config.get('username');
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.user = user;
    if (user) {
      this.userList(user);
    } else {
      this.list();
    }
    this.terminal.on('input', (this.eventFns.input = this.onInput.bind(this)));
    super.load();
  }

  async unload() {
    this.terminal.off('input', this.eventFns.input);
    super.unload();
  }

  async help() {
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    super.help();
  }

  async userList(user: string, page = 1) {
    this.terminal.clear();
    this.log(this.terminal.Bold.green.raw('清风明月'), ' - ', this.terminal.cyan.raw(`${user}`));
    const size = this.terminal.info.height - 3;
    this.fishpi.breezemoon.listByUser(user, page, size).then((breezes) => {
      this.page = page;
      this.render(breezes.breezemoons);
    });
  }

  async list(page = 1) {
    this.terminal.clear();
    this.log(this.terminal.Bold.green.raw('清风明月'));
    const size = this.terminal.info.height - 3;
    this.fishpi.breezemoon.list(page, size).then((breezes) => {
      this.page = page;
      this.render(breezes);
    });
  }

  render(breezes: BreezemoonContent[]) {
    breezes.forEach((breeze, i) => {
      this.log(
        this.terminal.yellow.raw(`${i}. `),
        '[',
        this.terminal.blue.raw(breeze.timeAgo),
        '] ',
        this.terminal.green.raw(breeze.authorName),
        breeze.city ? this.terminal.cyan.raw(` (${breeze.city})`) : '',
        ': ',
        breeze.content.replace(/<\/*p>/g, ''),
      );
    });
    this.terminal.setTip(`输入 n 下一页, p 上一页, s 发送清风明月，输入模式下可直接发送清风明月`);
    this.terminal.setInputMode(TerminalInputMode.CMD);
  }

  onInput(cmd: string) {
    this.send(cmd);
  }

  next() {
    this.user ? this.userList(this.user, this.page + 1) : this.list(this.page + 1);
  }

  prev() {
    if (this.page > 1)
      this.user ? this.userList(this.user, this.page - 1) : this.list(this.page - 1);
  }

  send(content: string) {
    this.fishpi.breezemoon
      .send(content)
      .then(() => {
        this.log(this.terminal.Bold.green.raw('发送成功'));
        this.list(1);
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
    this.terminal.setInputMode(TerminalInputMode.CMD);
  }
}
