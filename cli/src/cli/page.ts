import { threadId } from 'worker_threads';
import { AccountCli, ChatRoomCli, Config, Terminal } from '.';
import { BaseCli, FishPi } from './lib';
import { ArticleCli } from './article';
import { BreezemoonCli } from './breezemoon';
import { NoticeCli } from './notice';
import { ChatCli } from './chat';
import { Command } from 'commander';

interface ICommand {
  cli: BaseCli;
  commands: string[];
  description: string;
}

export class Page {
  terminal: Terminal;
  fishpi: FishPi;
  commands: Record<string, ICommand> = {};
  account: AccountCli;
  notice: NoticeCli;
  currentPage?: BaseCli;
  defaultPage: string = '';
  defaultCommand: string = '';

  constructor(terminal: Terminal, fishpi: FishPi) {
    this.terminal = terminal;
    this.fishpi = fishpi;
    this.account = new AccountCli(this.fishpi, this.terminal);
    this.notice = new NoticeCli(this.fishpi, this.terminal);
    const chatroom = new ChatRoomCli(this.fishpi, this.terminal);
    const article = new ArticleCli(this.fishpi, this.terminal);
    const breezemoon = new BreezemoonCli(this.fishpi, this.terminal);
    const chat = new ChatCli(this.fishpi, this.terminal);

    this.commands = {
      chatroom: { cli: chatroom, commands: ['chatroom', 'cr'], description: '聊天室' },
      chat: { cli: chat, commands: ['chat', 'c'], description: '私聊' },
      article: { cli: article, commands: ['article', 'a'], description: '文章' },
      breezemoon: { cli: breezemoon, commands: ['breezemoon', 'b'], description: '清风明月' },
      notice: { cli: this.notice, commands: ['notice', 'o'], description: '通知' },
      account: { cli: this.account, commands: ['user', 'u'], description: '个人页' },
    };
  }

  get version() {
    return this.account.version;
  }

  commander(program: Command) {
    program
      .command('login')
      .description('登录/切换账号')
      .argument('[username]', '指定登录的用户名')
      .option('-t --token <token>', '使用 Token 登录')
      .action(async (username, options) => {
        Config.set('token', '');
        if (options.token) {
          this.fishpi.setToken(options.token);
          const info = await this.fishpi.account.info().catch(() => undefined);
          if (!info) {
            console.error('error: Token 无效，登录失败！');
            process.exit(1);
          }
          if (username && info.userName !== username) {
            console.error('error: Token 与用户名不匹配，请检查或不传递用户名！');
            process.exit(1);
          }
          Config.set('token', options.token);
          Config.set('username', info.userName);
        } else if (username) {
          Config.set('username', username);
        }
      });
    Object.keys(this.commands).forEach((page) => {
      program
        .command(page)
        .description('启动并进入' + this.commands[page].description + '，可传递参数执行页面指令')
        .arguments('[commands...]')
        .addHelpText('after', this.commands[page].cli.helpText())
        .action((args: string[]) => {
          this.defaultPage = page;
          this.defaultCommand = args.join(' ');
        });
    });
  }

  command(program: Command) {
    this.commander(program);
    Object.keys(this.commands).forEach((page) => {
      const command = this.commands[page];
      command.cli.commander(program).then((command) => {
        if (command) this.defaultCommand = command;
      });
    });
  }

  async init(relogin: boolean = false) {
    const isLoggedIn = await this.account.isLogin();
    if (!isLoggedIn) {
      console.info('您尚未登录，请先登录！');
    }
    if (
      (!isLoggedIn || relogin) &&
      !(await this.account.login().catch((err) => console.error('登录失败：' + err.message)))
    ) {
      return false;
    }

    process.stdin.removeAllListeners('data');

    this.terminal.init();
    this.notice.addListener();
    this.terminal.on('cmd', this.onCommand.bind(this));

    if (this.defaultPage) {
      const command = this.commands[this.defaultPage];
      if (command) {
        this.currentPage = command.cli;
        await this.currentPage.load();
        this.currentPage.command(this.defaultCommand);
      }
    } else if (this.defaultCommand) {
      this.onCommand(this.defaultCommand);
    }
    return true;
  }

  async onCommand(cmd: string) {
    const cmds = cmd.trim().replace(/\s+/g, ' ').split(' ');
    if (cmds.length === 0) return;
    switch (cmds[0]) {
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
          break;
        }
      case 'quit':
        this.terminal.log(this.terminal.Bold.blue.text('Bye~'));
        setTimeout(() => process.exit(0), 500);
        break;
      default: {
        const page = Object.keys(this.commands).find((c) =>
          this.commands[c].commands.includes(cmds[0]),
        );
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
    const maxLength =
      Math.max(
        8,
        ...Object.keys(this.commands).map(
          (page) => this.commands[page].commands.join(' / ').length,
        ),
        4,
      ) + 4;
    Object.keys(this.commands).forEach((page) => {
      const command = this.commands[page];
      const descriptions = command.description
        .split('\n')
        .map((d, i) => (i === 0 ? d : '\t' + ' '.repeat(maxLength) + '\t' + d));
      this.terminal.tab(
        1,
        this.terminal.yellow.raw(`${command.commands.join(' / ')}`.padEnd(maxLength)),
        '\t',
        descriptions.join('\n'),
      );
    });
    this.terminal.tab(1, this.terminal.yellow.raw(`help / h`.padEnd(maxLength)), '\t', '查看帮助');
    this.terminal.tab(
      1,
      this.terminal.yellow.raw(`exit / q`.padEnd(maxLength)),
      '\t',
      '退出程序 / 返回首页',
    );
    this.terminal.log('');
    this.terminal.setTip(
      this.terminal.gray.text('输入') +
        this.terminal.Inverse.text(' : ') +
        this.terminal.gray.text('进入命令输入模式，') +
        this.terminal.gray.text('输入') +
        this.terminal.Inverse.text(' / ') +
        this.terminal.gray.text('进入文字输入模式（若该页面支持）。'),
    );
  }
}
