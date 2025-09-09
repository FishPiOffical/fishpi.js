import { Config } from './config';
import { BaseCli, FishPi } from './lib';
import { Terminal, TerminalInputMode } from './terminal';

export class BreezemoonCli extends BaseCli {
  me: string | undefined;
  eventFns: any = {};
  page: number = 1;
  
  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.commands = [
      { commands: ['next', 'n'], description: '下一页清风明月', call: this.next.bind(this) },
      { commands: ['prev', 'p'], description: '上一页清风明月', call: this.prev.bind(this) },
      { commands: ['send', 's'], description: '发送清风明月，示例：s 今天天气真好！', call: this.send.bind(this) },
    ];
  }

  async load() {
    this.me = Config.get('username');
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.render();
    this.terminal.on('input', this.eventFns.input = this.onInput.bind(this));
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

  async render(page = 1) {
    this.terminal.clear();
    this.log(this.terminal.Bold.green.raw('清风明月'));
    const size = this.terminal.info.height - 3;
    this.fishpi.breezemoon.list(page, size).then((breezes) => {
      this.page = page;
      breezes.forEach((breeze, i) => {
        this.log(
          this.terminal.yellow.raw(`${i}. `),
          '[',
          this.terminal.blue.raw(breeze.timeAgo),
          '] ',
          this.terminal.green.raw(breeze.breezemoonAuthorName),
          breeze.breezemoonCity ? this.terminal.cyan.raw(` (${breeze.breezemoonCity})`) : '',
          ': ',
          breeze.breezemoonContent.replace(/<\/*p>/g, ''),
        );
      });
      this.terminal.setTip(`输入 n 下一页, p 上一页, s 发送清风明月，输入模式下可直接发送清风明月`);
      this.terminal.setInputMode(TerminalInputMode.CMD);
    })
  }

  onInput(cmd: string) {
    this.send(cmd);
  }

  next() {
    this.render(this.page + 1);
  }

  prev() {
    if (this.page > 1) this.render(this.page - 1);
  }

  send(content: string) {
    this.fishpi.breezemoon.send(content).then(() => {
      this.log(this.terminal.Bold.green.raw('发送成功'));
      this.render(1);
    }).catch(err => {
      this.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
    this.terminal.setInputMode(TerminalInputMode.CMD);
  }
}