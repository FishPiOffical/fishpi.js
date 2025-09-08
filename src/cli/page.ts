import { threadId } from "worker_threads";
import { AccountCli, ChatRoomCli, Terminal } from ".";
import { BaseCli, FishPi } from "./lib";
import { ArticleCli } from "./article";
import { BreezemoonCli } from "./breezemoon";

interface ICommand {
  cli: BaseCli,
  commands: string[],
  description: string;
}

export class Page {
  terminal: Terminal;
  fishpi: FishPi;
  commands: Record<string, ICommand> = {};
  account: AccountCli;
  currentPage?: BaseCli;

  constructor(terminal: Terminal, fishpi: FishPi) {
    this.terminal = terminal;
    this.fishpi = fishpi;    
    this.account = new AccountCli(this.fishpi, this.terminal);
  }

  async init () {
    const isLoggedIn = await this.account.isLogin();
    if (!isLoggedIn) {
      console.info('您尚未登录，请先登录！');
    }
    if (!isLoggedIn && !(await this.account.login().catch(err => console.error('登录失败：' + err.message)))) {
      return false;
    }
    const chatroom = new ChatRoomCli(this.fishpi, this.terminal);
    const article = new ArticleCli(this.fishpi, this.terminal);
    const breezemoon = new BreezemoonCli(this.fishpi, this.terminal);
    this.commands = {
      chatroom: { cli: chatroom, commands: ['chatroom', 'cr'], description: '聊天室' },
      article: { cli: article, commands: ['article', 'a'], description: '文章' },
      breezemoon: { cli: breezemoon, commands: ['breezemoon', 'b'], description: '清风明月' },
      account: { cli: this.account, commands: ['profile', 'p'], description: '个人页' },
    }
    this.terminal.on('cmd', this.onCommand.bind(this));
    return true;
  }

  async onCommand(cmd: string) {
    const cmds = cmd.trim().replace(/\s+/, ' ').split(' ');
    if (cmds.length === 0) return;
    switch(cmds[0]) {
      case 'help':
      case 'h':
        if (!this.currentPage) this.help();
        else this.currentPage.help();
        break;
      case 'exit':
      case 'q':
        if (this.currentPage) {
          this.currentPage.unload();
          this.currentPage = undefined;
          this.help();
        } else {
          this.terminal.log('Bye~')
          setTimeout(() => process.exit(0), 500);
        }
        break;
      default:
        {
          const page = Object.keys(this.commands).find(c => this.commands[c].commands.includes(cmds[0]));
          if (page) {
            const command = this.commands[page];
            this.currentPage?.unload();
            this.terminal.clear();
            command.cli.load(...cmds.slice(1));
            this.currentPage = command.cli;
          } else if (this.currentPage) {
            this.currentPage.command(cmd);
          }
        }
    }
  }

  async load() {
    this.help();
  }

  help() {
    this.terminal.clear();
    const me = this.account.me;
    this.terminal.log('欢迎您~', this.terminal.Bold.cyan.raw(me?.userNickname || me?.userName));
    this.terminal.log('');
    this.terminal.log(this.terminal.blue.raw('全局命令：'));
    const maxLength = Math.max(8, ...Object.keys(this.commands).map(page => this.commands[page].commands.join(' / ').length), 4) + 4;
    Object.keys(this.commands).forEach(page => {
      const command = this.commands[page];
      const descriptions = command.description.split('\n').map((d, i) => (i === 0 ? d : '\t' + ' '.repeat(maxLength) + '\t' + d));
      this.terminal.tab(1, this.terminal.yellow.raw(`${command.commands.join(' / ')}`.padEnd(maxLength)), '\t', descriptions.join('\n'));
    });
    this.terminal.tab(1, this.terminal.yellow.raw(`help / h`.padEnd(maxLength)), '\t', '查看帮助');
    this.terminal.tab(1, this.terminal.yellow.raw(`exit / q`.padEnd(maxLength)), '\t', '退出程序 / 返回首页');
    this.terminal.log('');
    this.terminal.setTip(
      this.terminal.gray.text('输入') + this.terminal.Inverse.text(' : ') + this.terminal.gray.text('进入命令输入模式，') +
      this.terminal.gray.text('输入') + this.terminal.Inverse.text(' / ') + this.terminal.gray.text('进入文字输入模式（若该页面支持）。'),
    );
  }
}