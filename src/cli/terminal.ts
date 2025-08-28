import blessed from "blessed";
import { EventEmitter, EventEmitterReferencingAsyncResource } from 'events';

export class TerminalStyle {
  style: {
    fg?: string;
    bg?: string;
    bold?: boolean;
    underline?: boolean;
    blink?: boolean;
    inverse?: boolean;
    invisible?: boolean;
  } = {};
  contents: string[] = [];

  constructor(style = {}) {
    this.style = style;
  }

  fg(color: string, text: string='') {
    this.style.fg = color;
    if (!text) return this;
    return this.render(text);
  }

  bg(color: string, text: string='') {
    this.style.bg = color;
    if (!text) return this;
    return this.render(text);
  }

  bold(text: string='') {
    this.style.bold = true;
    if (!text) return this;
    return this.render(text);
  }

  underline(text: string='') {
    this.style.underline = true;
    if (!text) return this;
    return this.render(text);
  }

  blink(text: string='') {
    this.style.blink = true;
    if (!text) return this;
    return this.render(text);
  }

  inverse(text: string='') {
    this.style.inverse = true;
    if (!text) return this;
    return this.render(text);
  }

  invisible(text: string='') {
    this.style.invisible = true;
    if (!text) return this;
    return this.render(text);
  }

  render(text: string) {
    let content = '';
    let styleCount = 0;
    if (this.style.fg) {
      content += `{${this.style.fg}-fg}`;
      styleCount++;
    }
    if (this.style.bg) {
      content += `{${this.style.bg}-bg}`;
      styleCount++;
    }
    if (this.style.bold) {
      content += `{bold}`;
      styleCount++;
    }
    if (this.style.underline) {
      content += `{underline}`;
      styleCount++;
    }
    if (this.style.blink) {
      content += `{blink}`;
      styleCount++;
    }
    if (this.style.inverse) {
      content += `{inverse}`;
      styleCount++;
    }
    if (this.style.invisible) {
      content += `{invisible}`;
      styleCount++;
    }
    content += text;
    for (let i = 0; i < styleCount; i++) {
      content += '{/}';
    }
    this.style = {};
    this.contents.push(content);
    return this;
  }

  text(text: string = '') {
    if (text) this.render(text);
    text = this.contents.join(' ')
    this.contents = [];
    return text;
  }

  toString() {
     return this.text();
  }

  get Bold() {
    return new TerminalStyle({ ...this.style, bold: true });
  }

  get Underline() {
    return new TerminalStyle({ ...this.style, underline: true });
  }

  get Inverse() {
    return new TerminalStyle({ ...this.style, inverse: true });
  }

  get Invisible() {
    return new TerminalStyle({ ...this.style, invisible: true });
  }

  get red() {
    return new TerminalStyle({ ...this.style, fg: 'red' });
  }

  get orangered () {
    return new TerminalStyle({ ...this.style, fg: 'orangered' });
  }

  get yellow() {
    return new TerminalStyle({ ...this.style, fg: 'yellow' });
  }

  get green() {
    return new TerminalStyle({ ...this.style, fg: 'green' });
  }

  get cyan() {
    return new TerminalStyle({ ...this.style, fg: 'cyan' });
  }

  get blue() {
    return new TerminalStyle({ ...this.style, fg: 'blue' });
  }

  get purple() {
    return new TerminalStyle({ ...this.style, fg: 'purple' });
  }

  get white() {
    return new TerminalStyle({ ...this.style, fg: 'white' });
  }

  get black() {
    return new TerminalStyle({ ...this.style, fg: 'black' });
  }

  get gray() {
    return new TerminalStyle({ ...this.style, fg: 'gray' });
  }
}

interface TerminalEvents {
  /**
   * 输入提交
   * @param value 提交的内容
   */
  input: (value: string) => void;
  /**
   * 输入命令
   * @param value 命令的内容
   */
  cmd: (value: string) => void;
  /**
   * 命令行退出
   */
  quit: () => void;
}

class TerminalInput {
  private screen?: blessed.Widgets.Screen;
  private input: blessed.Widgets.TextboxElement;
  private inputLabel: blessed.Widgets.BoxElement;
  private emitter: EventEmitter;
  private inputMode = 'cmd';

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.input = blessed.textbox({
      bottom: 0,
      left: 2,
      width: "100%",
      height: 1,
      inputOnFocus: true,
      mouse: true,
    });
    this.inputLabel = blessed.box({
      bottom: 0,
      left: 0,
      width: 1,
      height: 1,
      content: '',
      tags: true,
      scrollable: false,
      style: {
        bold: true,
        fg: 'yellow',
      }
    });
  }

  register(screen: blessed.Widgets.Screen) {
    screen.append(this.inputLabel);
    screen.append(this.input);
    this.screen = screen;

    this.onListen();
  }

  onListen() {
    this.input.on('submit', (value) => {
      this.emitter.emit(this.inputMode, value);
      this.input.clearValue();
      if (this.screen?.focused != this.input) this.input.focus();
      this.screen?.render();
    });

    this.input.key(['/'], () => {
      if (!this.input.getValue().startsWith('/')) return;
      this.inputLabel.setContent('>');
      if (this.screen?.focused != this.input) this.input.focus();
      this.inputMode = 'input';
      this.input.clearValue();
      this.screen?.render();
    });

    this.input.key([':'], () => {
      if (!this.input.getValue().startsWith(':')) return;
      this.inputLabel.setContent(':');
      if (this.screen?.focused != this.input) this.input.focus();
      this.inputMode = 'cmd';
      this.input.clearValue();
      this.screen?.render();
    });

    this.input.key(['escape'], () => {
      this.inputLabel.setContent('');
      this.input.hide();
      this.screen?.render();
    });
  }

  setInputMode(mode: string, label?: string) {
    this.inputMode = mode;
    this.input.show();
    this.inputLabel.setContent(label ?? { cmd: ':', input: '>' }[mode] ?? '');
    if (this.screen?.focused != this.input) this.input.focus();
    this.inputMode = mode;
    this.screen?.render();
  }

  clear() {
    this.input.clearValue();
  }
}

export class Terminal extends TerminalStyle {
  private screen: blessed.Widgets.Screen;
  private output: blessed.Widgets.BoxElement;
  private emitter: EventEmitter = new EventEmitter();
  private input: TerminalInput;

  constructor() {
    super();
    this.screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
      title: "FishPi Terminal",
    });

    this.output = blessed.box({
      top: 0,
      left: 0,
      width: "100%",
      height: "100%-1",
      content: "",
      tags: true,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      mouse: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'default'
        },
        style: {
          inverse: true
        }
      },
      style: {
        scrollbar: { bg: 'blue' }
      },
    });
    this.input = new TerminalInput(this.emitter);
    this.input.register(this.screen);
    this.screen.append(this.output);

    this.output.on('click', () => {
      this.screen.focusPop();
    });

    this.screen.key(['C-c'], () => {
      this.emitter.emit('quit');
      this.log('Bye~')
      return setTimeout(() => process.exit(0), 500);
    });
    
    this.screen.key(['/'], () => {
      this.input.setInputMode('input');
    });

    this.screen.key([':'], () => {
      this.input.setInputMode('cmd');
    });

    this.screen.on('keypress', (ch) => {
      this.emitter.emit('keydown', ch);
    })
  }

  append(content: string, refresh = true): void {
    this.output.pushLine(content);
    this.output.scrollTo(this.output.getLines().length);
    if (refresh) this.refresh();
  }

  log(...args: string[]) {
    this.append(args.join(' '));
  }

  clear() {
    this.output.setContent('');
    this.refresh();
    this.input.clear();
  }

  refresh(): void {
    this.screen.render();
  }

  close(): void {
    this.screen.destroy();
  }

  on<K extends keyof TerminalEvents>(event: K, listener: TerminalEvents[K]) {
    return this.emitter.on(event, listener);
  }

  off<K extends keyof TerminalEvents>(event?: K, listener?: TerminalEvents[K]) {
    if (!event) return this.emitter.removeAllListeners();
    if (!listener) return this.emitter.removeAllListeners(event);
    return this.emitter.off(event, listener);
  }

  once<K extends keyof TerminalEvents>(event: K, listener: TerminalEvents[K]) {
    return this.emitter.once(event, listener);
  }
}