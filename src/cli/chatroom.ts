import { ChatContentType, FishPi, BaseCli, IChatRoomMsg } from './lib';
import { Terminal } from './terminal';

export class ChatRoomCli extends BaseCli {
  eventFn: Record<string, any> = {};

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.fishpi.chatroom.setVia('Node Cli', this.fishpi.version);
  }

  async load() {
    const history = await this.fishpi.chatroom.history(1, ChatContentType.Markdown);
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

  renderMessage(msg: IChatRoomMsg) {
    const time = this.terminal.blue.text(`[${msg.time}]`);
    const nickname = this.terminal.Bold.green.text(msg.userNickname || msg.userName + (msg.userNickname ? '' : ':'));
    const username = msg.userNickname ? this.terminal.gray.text(` (${msg.userName}):`) : '';
    const content = this.terminal.white.text(msg.md.replace(/\n+/, '\n'));
    this.log(time, nickname + username, content);
  }
}
