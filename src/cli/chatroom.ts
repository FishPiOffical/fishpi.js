import { Config } from './config';
import { ChatContentType, FishPi, BaseCli, IChatRoomMsg, IChatRoomMessage, IAtUser, IOnlineInfo, DiscussMsg, RevokeMsg, IBarragerMsg, IChatMusic, IChatWeather, IRedpacket, CustomMsg } from './lib';
import { ITerminalKeyEvent, Terminal, TerminalInputMode } from './terminal';

export class ChatRoomCli extends BaseCli {
  eventFn: Record<string, any> = {};
  me: string | undefined;
  redpacketIds: string[] = [];
  atList: IAtUser[] = [];
  currentAt: number = 0;
  mode: 'cmd' | 'chat' = 'chat';
  msgList: any[] = [];

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.fishpi.chatroom.setVia('Node Cli', this.fishpi.version);
    this.commands = [
      { commands: ['back', 'bk'], description: '返回聊天室', call: this.toChat.bind(this) },
      { commands: ['history', 'hs'], description: '查看历史消息，可以传递页码或消息ID，例如 history 3', call: this.toHistory.bind(this) },
      { commands: ['online', 'ol'], description: '查看在线用户', call: this.toOnline.bind(this) },
      { commands: ['discuss', 'dc'], description: '修改聊天室话题，例如 discuss 这是新的话题', call: this.discuss.bind(this) },
      { commands: ['reply', 'ry'], description: '回复消息，参数为消息 ID 和回复内容，例如 reply 1757055214050 你好', call: this.reply.bind(this) },
      { commands: ['barrage', 'br'], description: '发送弹幕消息，例如 barrage 你好 或 barrage 你好 #ff0000', call: this.barrage.bind(this) },
      { commands: ['revoke', 'rk'], description: '撤回消息，参数为消息 ID ，例如 revoke 1757055214050', call: this.revoke.bind(this) },
      { commands: ['redpack', 'rp'], description: `打开红包，参数为红包 ID。
可以使用 . 表示最后一个发出的红包，
而猜拳红包可以使用 1/2/3 指代 石头/剪刀/布，
例如： rp 1757055214050 或 rp . 1`, call: this.openRedpack.bind(this) },
    ]
  }

  async toChat() {
    this.mode = 'chat';
    this.terminal.setInputMode(TerminalInputMode.INPUT);
    this.terminal.setTip('输入消息按 Enter 发送，:exit 退出聊天室，:help 查看帮助');
    this.terminal.clear();
    this.msgList = [];
    const history = await this.fishpi.chatroom.history(1, ChatContentType.Markdown);
    history.reverse().forEach(msg => this.render(msg));
    this.terminal.setInputMode(TerminalInputMode.INPUT);
  }

  async toHistory(data: string, size: string) {
    this.mode = 'cmd';
    if (data.length && isNaN(Number(data))) {
      this.log(this.terminal.red.raw(`[错误]: 参数必须是数字，表示要获取的历史消息页数或消息Id`));
      return;
    }
    let history: IChatRoomMessage[] = [];
    if (data.length != 13) {
      history = await this.fishpi.chatroom.history(Number(data), ChatContentType.Markdown);
    } else {
      history = await this.fishpi.chatroom.get({ oId: data, size: isNaN(Number(size)) ? 25 : Number(size), type: ChatContentType.Markdown });
    }
    this.terminal.clear();
    history.reverse().forEach(msg => this.render(msg));
  }

  async toOnline() {
    this.mode = 'cmd';
    this.terminal.setInputMode(TerminalInputMode.CMD);
    const users = await this.fishpi.chatroom.onlines;
    this.log(this.terminal.green.raw(`当前在线用户 ${users.length} 人：`));
    let onlines = '';
    const maxLength = Math.max(...users.map((u, i) => u.userName.length));
    const indexLength = String(users.length).length;
    const size = Math.floor(Number(this.terminal.info.width) / (maxLength + 4)) - 1;
    users.forEach((u: IOnlineInfo, i) => {
      onlines += this.terminal.yellow.text(`${i.toString().padStart(indexLength, ' ')}.`) + this.terminal.text(`${u.userName.padEnd(maxLength, ' ')}\t`);
      if ((i + 1) % size == 0) onlines += '\n';
    });
    this.log(onlines);
  }

  async reply(oId: string, content: string) {
    const msg = await this.fishpi.chatroom.get({ oId, size: 1, type: ChatContentType.Markdown })
    .then(msgs => msgs?.find(m => m.oId == oId)).catch(() => undefined);
    if (!msg) {
      this.log(this.terminal.red.raw(`[错误]: 未找到要回复的消息 ${oId}`));
      return;
    }
    const replyContent = `${content}\n\n##### 引用 @${msg.userName}[↩](https://fishpi.cn/cr#chatroom${oId} "跳转至原消息")\n
> ${msg.md.split('\n').map(line => `> ${line}`).join('\n')}`;
    this.fishpi.chatroom.send(replyContent);
  }

  async barrage(content: string, color?: string) {
    this.fishpi.chatroom.barrage(content, color);
  }

  discuss(content: string) {
    this.fishpi.chatroom.discusse = content;
  }

  async revoke(oId: string) {
    this.fishpi.chatroom.revoke(oId);
  }

  async openRedpack(oId: string, gesture?: string) {
    if (oId == '.') {
      if (!this.redpacketIds.length) {
        this.log(this.terminal.red.raw(`[错误]: 当前没有可用的红包 ID`));
        return;
      }
      oId = this.redpacketIds[this.redpacketIds.length - 1];
    }
    this.fishpi.chatroom.redpacket.open(oId, gesture ? Number(gesture) : undefined)
      .catch(err => this.log(this.terminal.red.raw(`[错误]: ${err.message}`)));
  }

  async help() {
    this.mode = 'cmd';
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    this.terminal.setTip('输入 ' + this.terminal.yellow.text('@') + 
    '用户名 后按下 Tab 键可自动补全用户名，输入 '+ this.terminal.yellow.text('#') + ' 后按下 Tab 键可补全当前话题');
    super.help();
  }

  async load() {
    this.me = Config.get('username');
    this.fishpi.chatroom.on('msg', this.eventFn.msg = this.onMessage.bind(this));
    this.fishpi.chatroom.on('music', this.eventFn.music = this.onMusic.bind(this));
    this.fishpi.chatroom.on('weather', this.eventFn.weather = this.onWeather.bind(this));
    this.fishpi.chatroom.on('redPacket', this.eventFn.redPacket = this.onRedPacket.bind(this));
    this.fishpi.chatroom.on('discuss', this.eventFn.discuss = this.onDiscussChanged.bind(this));
    this.fishpi.chatroom.on('barrager', this.eventFn.barrage = this.onBarrager.bind(this));
    this.fishpi.chatroom.on('custom', this.eventFn.custom = this.onCustom.bind(this));
    this.fishpi.chatroom.on('revoke', this.eventFn.revoke = this.onRevoke.bind(this));
    this.terminal.on('input', this.eventFn.input = this.onInput.bind(this));
    this.terminal.on('complete', this.eventFn.complete = this.onComplete.bind(this));
    this.terminal.on('keydown', this.eventFn.key = this.onKeyDown.bind(this));
    this.toChat();
    super.load();
  }

  async unload() {
    this.fishpi.chatroom.off('msg', this.eventFn.msg);
    this.fishpi.chatroom.off('music', this.eventFn.music);
    this.fishpi.chatroom.off('weather', this.eventFn.weather);
    this.fishpi.chatroom.off('redPacket', this.eventFn.redPacket);
    this.fishpi.chatroom.off('discuss', this.eventFn.discuss);
    this.fishpi.chatroom.off('barrager', this.eventFn.barrage);
    this.fishpi.chatroom.off('custom', this.eventFn.custom);
    this.fishpi.chatroom.off('revoke', this.eventFn.revoke);
    this.terminal.off('input', this.eventFn.input);
    this.terminal.off('complete', this.eventFn.complete);
    this.terminal.off('keydown', this.eventFn.key);
    super.unload();
  }

  onMessage(msg: IChatRoomMsg) {
    if (this.mode != 'chat') return;
    this.render(msg);
  }

  onMusic(msg: IChatRoomMsg<IChatMusic>) {
    if (this.mode != 'chat') return;
    this.render(msg);
  }

  onWeather(msg: IChatRoomMsg<IChatWeather>) {
    if (this.mode != 'chat') return;
    this.render(msg);
  }

  onRedPacket(msg: IChatRoomMsg<IRedpacket>) {
    if (this.mode != 'chat') return;
    this.render(msg);
  }

  onDiscussChanged(msg: DiscussMsg) {
    if (this.mode != 'chat') return;
    this.log(this.terminal.yellow.raw(`🎤#${msg}`));
  }

  onBarrager(msg: IBarragerMsg) {
    if (this.mode != 'chat') return;
    this.log(
      this.terminal.fg(msg.barragerColor).raw('[') + 
      `${msg.barragerContent}` + 
      this.terminal.fg(msg.barragerColor).raw(']')
    );
  }

  onCustom(msg: CustomMsg) {
    if (this.mode != 'chat') return;
    this.log(this.terminal.gray.raw(`(${msg})`));
  }

  onRevoke(msg: RevokeMsg) {
    this.msgList = this.msgList.filter(m => m.oId != msg);
    if (this.mode != 'chat') return;
    this.msgList.forEach(msg => this.render(msg));
  }

  onInput(value: string) {
    this.fishpi.chatroom.send(value).catch(err => {
      this.log(this.terminal.red.raw(`[错误]: ${err.message}`));
    });
    this.atList = [];
    this.currentAt = 0;
    this.terminal.setTip('');
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
      mat = text.match(/#$/);
      if (mat) {
        callback(text.slice(0, -1) + `*\`# ${this.fishpi.chatroom.discusse} #\`*` + ' ');
      }
    }
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

  render(msg: any) {
    this.msgList.push(msg);
    if (msg.type == 'msg') {
      return this.renderMessage(msg);
    }
    if (msg.type == 'music') {
      return this.renderMusic(msg);
    }
    if (msg.type == 'weather') {
      return this.renderWeather(msg);
    }
    if (msg.type == 'redPacket') {
      return this.renderRedPacket(msg);
    }
  }

  getRenderHeader(msg: { time: string; userNickname: string; userName: string; oId: string; }) {
    const time = this.terminal.blue.raw(`${msg.time}`);
    const nickname = this.terminal.Bold.green.raw((msg.userNickname || msg.userName) + (msg.userNickname ? `(${msg.userName})` : ''));
    const oId = this.terminal.gray.raw(`[${msg.oId}]:`);
    return { time, nickname, oId };
  }

  renderMessage(msg: { time: string; userNickname: string; userName: string; oId: string; md: string; }) {
    const { time, nickname, oId } = this.getRenderHeader(msg);
    const content = this.terminal.white.raw(this.filterContent(msg.md));
    this.log(time, ' ', nickname, ' ', oId, ' ', content);
  }

  renderMusic(msg: IChatRoomMsg<IChatMusic>) {
    const { time, nickname, oId } = this.getRenderHeader(msg);
    const content = this.terminal.white.raw(`[🎵${msg.content.title}]`);
    this.log(time, ' ', nickname, ' ', oId, ' ', content);
  }

  renderWeather(msg: IChatRoomMsg<IChatWeather>) {
    const { time, nickname, oId } = this.getRenderHeader(msg);

    const weatherIcon = {
      CLEAR_DAY: '☀️',
      CLEAR_NIGHT: '🌙',
      CLOUDY: '☁️',
      DUST: '🤧',
      FOG: '🌫️',
      HEAVY_HAZE: '⛆',
      HEAVY_RAIN: '🌧️',
      HEAVY_SNOW: '❄️',
      LIGHT_HAZE: '🌫️',
      LIGHT_RAIN: '🌧️',
      LIGHT_SNOW: '❄️',
      MODERATE_HAZE: '⛆',
      MODERATE_RAIN: '🌧️',
      MODERATE_SNOW: '❄️',
      PARTLY_CLOUDY_DAY: '⛅',
      PARTLY_CLOUDY_NIGHT: '🌙',
      SAND: '⛱️',
      STORM_RAIN: '⛈️',
      STORM_SNOW: '❄️',
      WIND: '🍃',
    };
    const content = [
      this.terminal.white.raw(`[${weatherIcon[msg.content.data[0].code]}`),
      this.terminal.Bold.raw(`${msg.content.city} `),
      this.terminal.gray.raw(`${msg.content.description}]`)
    ];
    this.log(time, ' ', nickname, ' ', oId, ' ', ...content);
  }
  
  renderRedPacket(msg: IChatRoomMsg<IRedpacket>) {
    this.redpacketIds.push(msg.oId);
    const { time, nickname, oId } = this.getRenderHeader(msg);
    const redpacketType = {
      random: '拼手气',
      average: '平分',
      specify: '专属',
      heartbeat: '心跳',
      rockPaperScissors: '猜拳',
    }
    const content = [
      this.terminal.red.raw(`[🧧${redpacketType[msg.content.type]}: ${msg.content.msg}]`),
      this.terminal.white.raw(` - ${msg.content.count} 个 / `),
      this.terminal.yellow.raw(`${msg.content.money} 积分`),
    ];
    this.log(time, ' ', nickname, ' ', oId, ' ', ...content);
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
      .replace(/(^\s*(>+)\s*.*?$)\n*(^\s*(\2)\s*.*?$\n*)*(?![\s\S])/gm, '') // 过滤小尾巴
      .replace(/^\s*>+\s*$/gm, '')                                // 过滤空引用
      .replaceAll(`@${this.me}`, `{bold}{yellow-fg}@${this.me}{/}{/}`) // 高亮@自己
      .replace(/@([^<]*?)( |$)/gm, '{green-fg}@$1$2{/}')             // 高亮@别人
      .replace(/<img\s+src="([^"]*?)"\s+alt="图片表情"([^>]*?>)/g, '[😀动画表情]')
      .replace(/<audio[^>]*?>.*?<\/audio>/g, '[🎵音频]')
      .replace(/<video[^>]*?>.*?<\/video>/g, '[🎬视频]')
      .replace(/<iframe[^>]*?src="([^"]*?)"[^>]*?>.*?<\/iframe>/g, '[内联网页]($1)')
      .replace(/<img\s+src="([^"]*?)"\s+([^>]*?>)/g, '[图片]($1)')
      .replace(/<(\w+)>(.*?)<\/\1>/gm, '$2')
      .trim();
    return content;
  }
}
