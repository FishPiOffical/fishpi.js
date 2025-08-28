import { ChatContentType, FishPi, BaseCli, IChatRoomMsg, UserInfo, IChatRoomMessage } from './lib';
import { Terminal } from './terminal';

export class ChatRoomCli extends BaseCli {
  eventFn: Record<string, any> = {};
  me: UserInfo | undefined;

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.fishpi.chatroom.setVia('Node Cli', this.fishpi.version);
  }

  async load() {
    this.me = await this.fishpi.account.info();
    const history = await this.fishpi.chatroom.history(1, ChatContentType.Markdown);
    history.reverse().forEach(msg => this.render(msg));
    this.fishpi.chatroom.on('msg', this.eventFn.msg = this.onMessage.bind(this));
    this.terminal.on('input', this.eventFn.input = this.onInput.bind(this));
  }

  async unload() {
    this.fishpi.chatroom.off('msg', this.eventFn.msg);
    this.terminal.off('input', this.eventFn.input);
  }

  onMessage(msg: IChatRoomMsg) {
    this.renderMessage(msg);
  }

  onInput(value: string) {
    this.fishpi.chatroom.send(value);
  }

  render(msg: IChatRoomMessage) {
    if (msg.type == 'msg') {
      return this.renderMessage(msg);
    }
  }

  renderMessage(msg: { time: string; userNickname: string; userName: string; oId: string; md: string; }) {
    const time = this.terminal.blue.text(`${msg.time}`);
    const nickname = this.terminal.Bold.green.text(msg.userNickname || msg.userName + (msg.userNickname ? `(${msg.userName})` : ''));
    const oId = this.terminal.gray.text(`[${msg.oId}]:`);
    const content = this.terminal.white.text(this.filterContent(msg.md));
    this.log(time, nickname + oId, content);
  }

  filterContent(content: string) {
    const lines = content.replace(/\n+/, '\n').split('\n');
    let quoteTab = '', beginQuote = false;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.trim().startsWith('##### 引用')) {
        beginQuote = true;
        quoteTab += '\t';
        line = quoteTab + line.replace(/##### 引用/, '└─引用');
      } else if (!line.startsWith('>')) {
        beginQuote = false;
      } else if (beginQuote && line.startsWith('>')) {
        line = quoteTab + line.slice(1);
      }
      lines[i] = line;
    }
    content = lines.join('\n');

    content = (content.trim().replace(/>+\s*$/gm, '').trim())
      .replace(/```(.*?)\n([\s\S]*?)```/g, '{inverse}$1\n$2{/inverse}') // ``` 代码块 ```
      .replace(/`(.*?)`/g, '{inverse}$1{/inverse}')
      .replace(/\*\*(.*?)\*\*/g, '{bold}$1{/bold}')               // **加粗**
      .replace(/__(.*?)__/g, '{bold}$1{/bold}')                   // __加粗__
      .replace(/\*(.*?)\*/g, '{underline}$1{/underline}')         // *下划线*
      .replace(/_(.*?)_/g, '{underline}$1{/underline}')           // _下划线_
      .replace(/\[↩\]\([^)]*?\)/g, '')                           // 过滤引用来源
      .replace(/(^(>+) .*?$)\n*(^(\2) .*?$\n*)*(?![\s\S])/g, '') // 过滤小尾巴
      .replace(/>+\s*$/gm, '')
      .replaceAll(`@${this.me?.userName}`, `{bold}{yellow-fg}@${this.me?.userName}{/}{/}`)
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
