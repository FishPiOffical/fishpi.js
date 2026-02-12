import path from 'path';
import fs from 'fs';
import { Config } from './config';
import { BaseCli, Candidate, FishPi, IAtUser, IChatData, searchFiles } from './lib';
import { ITerminalKeyEvent, Terminal, TerminalInputMode } from './terminal';

export class ChatCli extends BaseCli {
  me: string | undefined;
  chatUser?: string;
  eventFns: any = {};
  list: IChatData[] = [];
  chats: IChatData[] = [];
  page: number = 1;

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.commands = [
      {
        commands: ['chat', 'c'],
        description: '与某人私聊，示例：c 用户名',
        call: this.toChat.bind(this),
      },
      {
        commands: ['reply', 'ry'],
        description: '回复某条消息，示例：ry 消息ID 回复内容',
        call: this.reply.bind(this),
      },
      {
        commands: ['revoke', 'rk'],
        description: '撤回某条消息，示例：rk 消息ID',
        call: this.revoke.bind(this),
      },
      {
        commands: ['history', 'hy'],
        description: '加载历史消息，示例：hy [页码]',
        call: this.history.bind(this),
      },
      { commands: ['next', 'n'], description: '下一页消息', call: this.next.bind(this) },
      { commands: ['prev', 'p'], description: '上一页消息', call: this.prev.bind(this) },
    ];
  }

  async load(username: string = '') {
    await super.load();
    this.me = Config.get('username');
    this.terminal.on('input', (this.eventFns.input = this.onInput.bind(this)));
    this.terminal.on('complete', (this.eventFns.complete = this.onComplete.bind(this)));
    this.candidate.load();
    if (username && username != this.me && (await this.toChat(username))) return;
    await this.render();
    if (username) {
      this.log(this.terminal.red.raw('用户 ' + username + ' 不存在.'));
    }
  }

  async unload() {
    this.terminal.off('input', this.eventFns.input);
    this.terminal.off('complete', this.eventFns.complete);
    this.fishpi.chat.close();
    this.candidate.unload();
    super.unload();
  }

  async help() {
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    super.help();
  }

  async render() {
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    this.log(this.terminal.Bold.green.raw('私聊'));
    this.chatUser = undefined;
    this.chats = [];
    this.list = await this.fishpi.chat.list();
    [...this.list].reverse().forEach((chat, i) => {
      this.log(
        this.terminal.yellow.text(`${this.list.length - i - 1}. `),
        '[',
        this.terminal.blue.text(chat.time),
        '] ',
        this.terminal.green.text(chat.receiverUserName),
        ': ',
        chat.user_session.startsWith(chat.fromId) ? this.terminal.cyan.text('(我)') : '',
        chat.preview,
      );
    });
    this.terminal.setTip(`输入编号或用户名开始聊天，按下 Tab 可补全用户名`);
    this.terminal.setInputMode(TerminalInputMode.CMD);
  }

  async toChat(username: string) {
    if (!username) {
      return this.log(this.terminal.red.raw('[错误]: 请传递用户名'));
    }
    const user = await this.fishpi.user(username);
    if (!user) return false;
    this.terminal.setInputMode(TerminalInputMode.INPUT);
    this.chatUser = username;
    this.terminal.setTip('');
    this.terminal.clear();
    this.history();
    this.fishpi.chat.channel(this.chatUser).on('data', (msg: IChatData) => {
      this.chats.push(msg);
      this.renderChat(msg);
    });
    this.fishpi.chat.channel(this.chatUser).on('revoke', (oId: string) => {
      const chat = this.chats.find((c) => c.oId == oId);
      if (chat) {
        chat.markdown = '[消息已撤回]';
        this.terminal.clear();
        this.chats.forEach((c) => this.renderChat(c));
      }
    });
    return true;
  }

  async history(page: number | string = 1) {
    if (!this.chatUser) {
      return this.log(this.terminal.red.raw('[错误]: 请先进入某个聊天'));
    }
    if (typeof page === 'string') {
      page = Number(page);
      if (isNaN(page) || page < 1) page = 1;
    }
    page = Number(page);
    this.page = page;
    this.fishpi.chat
      .channel(this.chatUser!)
      .get({ page })
      .then((chats) => {
        this.chats = chats?.reverse() || [];
        this.chats.forEach((chat) => this.renderChat(chat));
        this.terminal.setTip(
          '输入消息内容，c 退出聊天，n 下一页，p 上一页，ry <消息Id> 回复某条消息，rk <消息Id> 撤回某条消息',
        );
      });
  }

  async updateFile(...paths: string[]) {
    if (!this.chatUser) {
      this.log(this.terminal.red.raw('[错误]: 请先进入某个聊天再上传文件'));
      return;
    }

    const { succMap } = await this.fishpi.upload(paths);
    Object.keys(succMap).forEach((k) => {
      const content = `![${k}](${succMap[k]})`;
      this.terminal.setInputMode(TerminalInputMode.INPUT);
      this.terminal.insert(content);
    });
  }

  next() {
    this.history(this.page + 1);
  }

  prev() {
    if (this.page > 1) this.history(this.page - 1);
  }

  revoke(oId: string) {
    if (!oId) {
      return this.log(this.terminal.red.raw('[错误]: 请传递消息 ID'));
    }
    this.fishpi.chat.revoke(oId);
  }

  async reply(oId: string, content: string) {
    if (!oId || !content) {
      return this.log(this.terminal.red.raw('[错误]: 参数错误，必须传递消息 ID 和回复内容'));
    }
    const msg = this.chats.find((m) => m.oId == oId);
    if (!msg) {
      this.log(this.terminal.red.raw(`[错误]: 未找到要回复的消息 ${oId}`));
      return;
    }
    const replyContent = `${content}\n\n##### 引用 [↩](https://fishpi.cn/chat#chat${oId} "跳转至原消息")\n
> ${msg.markdown
      .split('\n')
      .map((line: string) => `> ${line}`)
      .join('\n')}`;
    this.send(replyContent);
  }

  renderChat(msg: IChatData) {
    const time = this.terminal.blue.raw(`${msg.time}`);
    const nickname =
      msg.senderUserName == this.me
        ? this.terminal.Bold.green.raw(msg.senderUserName)
        : this.terminal.green.raw(msg.senderUserName);
    const oId = this.terminal.white.raw(`[${msg.oId}]:`);
    const content = this.filterContent(msg.markdown);
    this.log(time, ' ', nickname, ' ', oId, ' ', content);
  }

  async command(cmd: string) {
    if (this.chatUser) return super.command(cmd);
    const cmds = cmd.trim().replace(/\s+/g, ' ').split(' ');
    const index = Number(cmds[0]);
    if (!isNaN(index) && index >= 0 && index < this.list.length) {
      const chat = this.list[index];
      this.toChat(chat.senderUserName == this.me ? chat.receiverUserName : chat.senderUserName);
    } else {
      this.toChat(cmds[0]);
    }
  }

  onComplete(text: string, mode: string, callback: (val: string) => void) {
    if (!this.chatUser) {
      this.userSearch(text, callback);
    } else {
      this.uploadMatch(text, callback);
    }
  }

  userSearch(user: string, callback: (val: string) => void) {
    this.fishpi.names(user).then((users: IAtUser[]) => {
      if (users.length == 1) {
        this.candidate.setCandidates([]);
        callback(users[0].userName);
      } else if (this.candidate.isMatch(user)) {
        callback(this.candidate.data);
        this.candidate.setCandidates([]);
      } else {
        this.candidate.setCandidates(users.map((u) => u.userName));
      }
    });
  }

  uploadMatch(text: string, callback: (val: string) => void) {
    let mat = text.match(/^upload\s+/);
    if (!mat) return;
    const filePath = text.replace(/^upload\s+/, '').trim();
    if (filePath.length == 0) return;
    const fileName = filePath.endsWith(path.sep) ? '' : path.basename(filePath);
    const files = searchFiles(filePath);

    function additionalFile(filePath: string, filename: string) {
      const tail = filePath.endsWith(path.sep) ? '' : path.basename(filePath);
      let text = filePath.trim().replace(new RegExp(`${tail}$`), filename);
      if (fs.lstatSync(text).isDirectory()) {
        text += path.sep;
      }
      return text;
    }

    if (files.length == 1) {
      callback(mat[0] + additionalFile(filePath, files[0]));
      this.candidate.setCandidates([]);
    } else if (this.candidate.isMatch(fileName, false)) {
      callback(mat[0] + additionalFile(filePath, this.candidate.data));
      this.candidate.setCandidates([]);
    } else {
      this.candidate.setCandidates(files.slice(0, 5));
    }
  }

  onInput(content: string) {
    if (!content) return;
    if (!this.chatUser) {
      return this.command(content);
    }
    this.send(content);
  }

  send(content: string) {
    if (!this.chatUser) return;
    this.fishpi.chat.channel(this.chatUser).send(content);
  }

  filterContent(content: string) {
    const lines = content
      .replace(/\n+/g, '\n')
      .split('\n')
      .filter((l) => l.replace(/^(>|\s)*/g, '').trim());
    let quoteTab = '',
      beginQuote = false;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.replace(/^(>|\s)*/g, '').startsWith('##### 引用')) {
        beginQuote = true;
        quoteTab += '\t';
        line = quoteTab + line.replace(/^(>|\s)*##### 引用/, '└─引用');
      } else if (!line.startsWith('>')) {
        beginQuote = false;
      } else if (beginQuote && line.startsWith('>')) {
        lines[i - 1] += ' ' + (lines[i - 1] ? '' : quoteTab) + line.replace(/^(>|\s)*/g, '');
        line = '';
      }
      lines[i] = line;
    }
    content = lines.filter((l) => l.trim()).join('\n');

    content = content
      .trim()
      .replace(/>+\s*$/gm, '')
      .trim()
      .replace(/```(.*?)\n([\s\S]*?)```/g, '{inverse}$1\n$2{/inverse}') // ``` 代码块 ```
      .replace(/`(.*?)`/g, '{inverse}$1{/inverse}')
      .replace(/\*\*(.*?)\*\*/g, '{bold}$1{/bold}') // **加粗**
      .replace(/__(.*?)__/g, '{bold}$1{/bold}') // __加粗__
      .replace(/\*(.*?)\*/g, '{underline}$1{/underline}') // *下划线*
      .replace(/_(.*?)_/g, '{underline}$1{/underline}') // _下划线_
      .replace(/\[↩\]\([^)]*?\)/g, '') // 过滤引用来源
      .replace(/<img\s+src="([^"]*?)"\s+alt="图片表情"([^>]*?>)/g, '[动画表情]')
      .replace(/<audio[^>]*?>.*?<\/audio>/g, '[🎵音频]')
      .replace(/<video[^>]*?>.*?<\/video>/g, '[🎬视频]')
      .replace(/<iframe[^>]*?src="([^"]*?)"[^>]*?>.*?<\/iframe>/g, '[内联网页]($1)')
      .replace(/<img\s+src="([^"]*?)"\s+([^>]*?>)/g, '[图片]($1)')
      .replace(/<(\w+)>(.*?)<\/\1>/gm, '$2')
      .trim();
    return content;
  }
}
