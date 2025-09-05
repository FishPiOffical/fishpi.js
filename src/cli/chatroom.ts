import { Config } from './config';
import { ChatContentType, FishPi, BaseCli, IChatRoomMsg, UserInfo, IChatRoomMessage, IAtUser } from './lib';
import { ITerminalKeyEvent, Terminal, TerminalInputMode, TerminalLine } from './terminal';

export class ChatRoomCli extends BaseCli {
  eventFn: Record<string, any> = {};
  me: string | undefined;
  atList: IAtUser[] = [];
  currentAt: number = 0;

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.fishpi.chatroom.setVia('Node Cli', this.fishpi.version);
  }

  async load() {
    this.me = Config.get('username');
    const history = await this.fishpi.chatroom.history(3, ChatContentType.Markdown);
    history.reverse().forEach(msg => this.render(msg));
    this.terminal.setInputMode(TerminalInputMode.INPUT);
    this.fishpi.chatroom.on('msg', this.eventFn.msg = this.onMessage.bind(this));
    this.terminal.on('input', this.eventFn.input = this.onInput.bind(this));
    this.terminal.on('hover', this.eventFn.hover = this.onHover.bind(this));
    this.terminal.on('leave', this.eventFn.leave = this.onLeave.bind(this));
    this.terminal.on('complete', this.eventFn.complete = this.onComplete.bind(this));
    this.terminal.on('keydown', this.eventFn.key = this.onKeyDown.bind(this));
  }

  async unload() {
    this.fishpi.chatroom.off('msg', this.eventFn.msg);
    this.terminal.off('input', this.eventFn.input);
    this.terminal.off('hover', this.eventFn.hover);
    this.terminal.off('leave', this.eventFn.leave);
    this.terminal.off('complete', this.eventFn.complete);
    this.terminal.off('keydown', this.eventFn.key);
  }

  onMessage(msg: IChatRoomMsg) {
    this.renderMessage(msg);
  }

  onInput(value: string) {
    this.fishpi.chatroom.send(value);
  }

  onComplete(text: string, mode: string, callback: (val: string) => void) {
    if (mode == TerminalInputMode.INPUT) {
      let mat = text.match(/@(\S{1,})$/);
      if (mat) {
        const userAt = mat[1];
        this.fishpi.names(userAt).then((users: IAtUser[]) => {
          if (users.length == 1) {
            this.atList = users;
            this.currentAt = 0;
          }
          if (this.atList[this.currentAt]?.userNameLowerCase.startsWith(userAt.toLowerCase())) {
            callback(text.replace(/@(\S{1,})$/, '@' + this.atList[this.currentAt]?.userName + ' '));
            this.terminal.setTip('');
          } else {
            this.atList = users;
            this.currentAt = 0;
            this.renderAtUsers();
          }
        })
      }
    }
  }

  onHover(line: TerminalLine, row: number, col: number) {
    let size = 0;
    let targetIdx = line.findIndex((l) => {
      size += l.content.length;
      return size >= col;
    });
    if (![2,4].includes(targetIdx)) return
    let content = line[targetIdx];
    content.style.underline = true;
    this.terminal.update(line, row);
  }

  onLeave(line: TerminalLine, row: number, col: number) {
    line.forEach(l => l.style.underline = false);
    this.terminal.update(line, row);
  }

  onKeyDown(key: ITerminalKeyEvent) {
    if (this.atList.length) {
      switch (key.full) {
        case 'left': this.currentAt = (this.currentAt - 1 + this.atList.length) % this.atList.length; this.renderAtUsers(); break;
        case 'right': this.currentAt = (this.currentAt + 1) % this.atList.length; this.renderAtUsers(); break;
      }
    }
  }

  renderAtUsers() {
    this.terminal.setTip(this.atList.map((u, i) => 
      i == this.currentAt ? 
      this.terminal.Inverse.text(`@${u.userName}`) : 
      `@${u.userName}`
    ).join('\t'));
  }

  render(msg: IChatRoomMessage) {
    if (msg.type == 'msg') {
      return this.renderMessage(msg);
    }
  }

  renderMessage(msg: { time: string; userNickname: string; userName: string; oId: string; md: string; }) {
    const time = this.terminal.blue.raw(`${msg.time}`);
    const nickname = this.terminal.Bold.green.raw((msg.userNickname || msg.userName) + (msg.userNickname ? `(${msg.userName})` : ''));
    const oId = this.terminal.gray.raw(`[${msg.oId}]:`);
    const content = this.terminal.white.raw(this.filterContent(msg.md));
    this.log(time, ' ', nickname, ' ', oId, ' ', content);
  }

  filterContent(content: string) {
    const lines = content.replace(/\n+/g, '\n').split('\n').filter(l => l.replace(/^(>|\s)*/g, '').trim());
    let quoteTab = '', beginQuote = false;
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
    content = lines.filter(l => l.trim()).join('\n');

    content = (content.trim().replace(/>+\s*$/gm, '').trim())
      .replace(/```(.*?)\n([\s\S]*?)```/g, '{inverse}$1\n$2{/inverse}') // ``` 代码块 ```
      .replace(/`(.*?)`/g, '{inverse}$1{/inverse}')
      .replace(/\*\*(.*?)\*\*/g, '{bold}$1{/bold}')               // **加粗**
      .replace(/__(.*?)__/g, '{bold}$1{/bold}')                   // __加粗__
      .replace(/\*(.*?)\*/g, '{underline}$1{/underline}')         // *下划线*
      .replace(/_(.*?)_/g, '{underline}$1{/underline}')           // _下划线_
      .replace(/\[↩\]\([^)]*?\)/g, '')                           // 过滤引用来源
      .replace(/(^(>+) .*?$)\n*(^(\2) .*?$\n*)*(?![\s\S])/gm, '') // 过滤小尾巴
      .replace(/>+\s*$/gm, '')
      .replace(/>+\s*$/gm, '')
      .replaceAll(`@${this.me}`, `{bold}{yellow-fg}@${this.me}{/}{/}`)
      .replace(/@([^<]*?)( |$)/gm, '{green-fg}@$1$2{/}')
      .replace(/<img\s+src="([^"]*?)"\s+alt="图片表情"([^>]*?>)/g, '[动画表情]')
      .replace(/<audio[^>]*?>.*?<\/audio>/g, '[音频]')
      .replace(/<video[^>]*?>.*?<\/video>/g, '[视频]')
      .replace(/<iframe[^>]*?src="([^"]*?)"[^>]*?>.*?<\/iframe>/g, '[内联网页]($1)')
      .replace(/<img\s+src="([^"]*?)"\s+([^>]*?>)/g, '[图片]($1)')
      .replace(/<(\w+)>(.*?)<\/\1>/gm, '$2')
      .trim();
    return content;
  }
}
