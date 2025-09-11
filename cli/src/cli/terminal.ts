import blessed from 'blessed';
import { EventEmitter } from 'events';

export interface ITerminalStyle {
  fg?: string;
  bg?: string;
  bold?: boolean;
  underline?: boolean;
  blink?: boolean;
  inverse?: boolean;
  invisible?: boolean;
}

export interface ITerminalContent {
  style: ITerminalStyle;
  content: string;
}

export type TerminalLine = ITerminalContent[];

export class TerminalContent {
  static toString(line: TerminalLine) {
    return line.map((l) => new TerminalStyle(l.style).text(l.content)).join('');
  }
}

export class TerminalStyle {
  style: ITerminalStyle = {};
  contents: string[] = [];
  srcs: ITerminalContent[] = [];

  constructor(style = {}) {
    this.style = style;
  }

  get Style() {
    return this.style;
  }

  fg(color: string, text: string = '') {
    this.style.fg = color;
    if (!text) return this;
    return this.render(text);
  }

  bg(color: string, text: string = '') {
    this.style.bg = color;
    if (!text) return this;
    return this.render(text);
  }

  bold(text: string = '') {
    this.style.bold = true;
    if (!text) return this;
    return this.render(text);
  }

  underline(text: string = '') {
    this.style.underline = true;
    if (!text) return this;
    return this.render(text);
  }

  blink(text: string = '') {
    this.style.blink = true;
    if (!text) return this;
    return this.render(text);
  }

  inverse(text: string = '') {
    this.style.inverse = true;
    if (!text) return this;
    return this.render(text);
  }

  invisible(text: string = '') {
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
    this.srcs.push({
      style: this.style,
      content: text,
    });
    this.style = {};
    this.contents.push(content);
    return this;
  }

  text(text: string = '') {
    if (text) this.render(text);
    text = this.contents.join(' ');
    this.contents = [];
    return text;
  }

  raw(text: string = '') {
    if (text) this.render(text);
    const srcs = this.srcs;
    this.contents = [];
    this.srcs = [];
    return srcs;
  }

  toString() {
    return this.text();
  }

  get Srcs() {
    return this.srcs;
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

  get orangered() {
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

class TerminalOutput {
  private tip: blessed.Widgets.BoxElement;
  private output: blessed.Widgets.Log;
  private screen?: blessed.Widgets.Screen;
  private emitter: EventEmitter;
  private todoAppend: TerminalLine[] = [];
  private lock = false;
  private src: TerminalLine[] = [];

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.output = blessed.log({
      top: 0,
      left: 0,
      width: '100%',
      height: '100%-1',
      content: '',
      tags: true,
      keyable: true,
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      mouse: false,
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'default',
        },
        style: {
          inverse: true,
        },
      },
      style: {
        scrollbar: { bg: 'blue' },
      },
    });
    this.tip = blessed.box({
      bottom: 1,
      left: 0,
      width: '100%',
      height: 1,
      content: '',
      tags: true,
      scrollable: false,
      mouse: false,
      style: {
        fg: 'cyan',
      },
    });
  }

  register(screen: blessed.Widgets.Screen) {
    this.screen = screen;
    screen.append(this.output);
    screen.append(this.tip);
    this.tip.hide();
    this.onListen();
  }

  onListen() {
    this.emitter.on('keydown', (key: ITerminalKeyEvent) => {
      if (key.full === 'pageup') {
        this.pageUp();
      } else if (key.full === 'pagedown') {
        this.pageDown();
      } else if (key.full == 'up') {
        this.output.scroll(-2);
        if (this.screen) this.screen.render();
      } else if (key.full == 'down') {
        this.output.scroll(2);
        if (this.screen) this.screen.render();
      } else if (key.full == 'home') {
        this.output.scrollTo(0);
        if (this.screen) this.screen.render();
      } else if (key.full == 'end') {
        this.output.scrollTo(this.output.getScrollHeight());
        if (this.screen) this.screen.render();
      }
    });
  }

  update(line: TerminalLine, row: number) {
    this.lock = true;
    const lines = this.src;
    lines[row] = line;
    if (this.todoAppend.length) lines.push(...this.todoAppend);
    this.setContent(lines);
    this.lock = false;
    this.todoAppend = [];
  }

  append(content: TerminalLine, refresh = true): void {
    if (this.lock) {
      this.todoAppend.push(content);
      return;
    }
    this.src.push(content);
    this.output.log(TerminalContent.toString(content));
    if (refresh && this.screen) this.screen.render();
  }

  log(...args: (TerminalLine | string)[]) {
    const line = args
      .map((a) => {
        if (typeof a === 'string') return [{ style: {}, content: a }];
        return a;
      })
      .flat();
    if (this.lock) {
      this.todoAppend.push(line);
      return;
    }
    this.append(line);
  }

  setContent(contents: TerminalLine[]) {
    this.output.setContent(contents.map(TerminalContent.toString).join('\n'));
    this.src = contents;
    if (this.screen) this.screen.render();
  }

  clear() {
    this.output.setContent('');
    this.src = [];
    if (this.screen) this.screen.render();
  }

  getLines() {
    return this.output.getLines();
  }

  setTip(tip: string) {
    if (!tip) {
      this.tip.hide();
      this.output.height = '100%-1';
    } else {
      this.tip.setContent(tip);
      this.tip.show();
      this.output.height = '100%-2';
    }
    if (this.screen) this.screen.render();
  }

  getTip() {
    return this.tip.getContent();
  }

  pageUp() {
    this.output.scroll(-this.output.height);
    if (this.screen) this.screen.render();
  }

  pageDown() {
    this.output.scroll(Number(this.output.height));
    if (this.screen) this.screen.render();
  }

  goTop() {
    this.output.scrollTo(0);
    if (this.screen) this.screen.render();
  }
}

export enum TerminalInputMode {
  CMD = 'cmd',
  INPUT = 'input',
  SHORTSHOT = 'shortshot',
}

class TerminalInput {
  private screen?: blessed.Widgets.Screen;
  private input: blessed.Widgets.TextboxElement;
  private inputLabel: blessed.Widgets.BoxElement;
  private emitter: EventEmitter;
  private inputMode: string = TerminalInputMode.SHORTSHOT;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.input = blessed.textbox({
      bottom: 0,
      left: 2,
      width: '100%',
      height: 1,
      inputOnFocus: true,
      mouse: false,
    });
    this.inputLabel = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 1,
      content: '',
      tags: true,
      mouse: false,
      scrollable: false,
      style: {
        bold: true,
        fg: 'yellow',
      },
    });
  }

  get mode() {
    return this.inputMode;
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

    this.input.key(['C-c'], () => {
      this.emitter.emit('quit');
    });

    this.input.key(['/'], () => {
      if (!this.input.getValue().startsWith('/')) return;
      this.input.clearValue();
      this.setInputMode(TerminalInputMode.INPUT);
    });

    this.input.key([':'], () => {
      if (!this.input.getValue().startsWith(':')) return;
      this.input.clearValue();
      this.setInputMode(TerminalInputMode.CMD);
    });

    this.input.key(['tab'], () => {
      const value = this.input.getValue().slice(0, -1);
      this.input.setValue(value);
      this.emitter.emit('complete', value, this.inputMode, (val: string) => {
        this.input.setValue(val);
        this.screen?.render();
      });
      this.screen?.render();
      return false;
    });

    this.input.key(['escape'], () => {
      this.inputLabel.setContent('');
      this.input.hide();
      this.screen?.render();
      this.inputMode = TerminalInputMode.SHORTSHOT;
    });

    this.input.on('keypress', (_ch, ev) => {
      this.emitter.emit('keydown', ev);
    });
  }

  setInputMode(mode: string, label?: string) {
    if (mode == 'shortshot') {
      this.inputLabel.setContent('');
      this.input.hide();
      this.screen?.render();
      this.inputMode = TerminalInputMode.SHORTSHOT;
      return;
    }
    if (this.inputMode == mode) return;
    this.inputMode = mode;
    this.input.show();
    this.inputLabel.setContent(label ?? { cmd: ':', input: '>' }[mode] ?? '');
    const strWidth = this.inputLabel.strWidth(this.inputLabel.getContent());
    this.input.left = strWidth + 1;
    this.inputLabel.width = strWidth;
    this.inputLabel.focus();
    if (this.screen?.focused != this.input) this.input.focus();
    this.inputMode = mode;
    this.screen?.render();
  }

  clear() {
    this.input.clearValue();
  }

  append(text: string) {
    this.input.setValue(this.input.getValue() + text);
    this.screen?.render();
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
   * 输入模式切换
   * @param value 模式
   */
  mode: (value: string) => void;
  /**
   * 按键按下
   * @param value 按键内容
   */
  keydown: (value: ITerminalKeyEvent) => void;
  /**
   * 自动补全
   * @param value 当前输入内容
   */
  complete: (value: string, mode: string, callback: (val: string) => void) => void;
  /**
   * 命令行退出
   */
  quit: () => void;
}

export type ITerminalKeyEvent = blessed.Widgets.Events.IKeyEventArg;

export class Terminal extends TerminalStyle {
  private screen?: blessed.Widgets.Screen;
  private input?: TerminalInput;
  private output?: TerminalOutput;
  private emitter: EventEmitter = new EventEmitter();

  constructor() {
    super();
  }

  get info() {
    return {
      width: Number(this.screen?.width || 0),
      height: Number(this.screen?.height || 0),
      inputMode: this.input?.mode || TerminalInputMode.SHORTSHOT,
    };
  }

  setInputMode(mode: string, label?: string) {
    this.input?.setInputMode(mode, label);
  }

  init() {
    const { screen, input, output } = this.register();
    this.screen = screen;
    this.input = input;
    this.output = output;
  }

  register() {
    const screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true,
      title: 'FishPi Terminal',
      useBCE: true,
      input: process.stdin,
      output: process.stdout,
    });
    const output = new TerminalOutput(this.emitter);
    const input = new TerminalInput(this.emitter);
    input.register(screen);
    output.register(screen);
    this.onListen(screen);
    this.screen = screen;
    this.screen.program.disableMouse();
    return {
      screen,
      input,
      output,
    };
  }

  onListen(screen: blessed.Widgets.Screen) {
    screen.key(['C-c'], () => {
      this.emitter.emit('quit');
    });

    screen.key(['/'], () => {
      this.input?.setInputMode(TerminalInputMode.INPUT);
    });

    screen.key([':'], () => {
      this.input?.setInputMode(TerminalInputMode.CMD);
    });

    screen.on('keypress', (_ch, ev) => {
      this.emitter.emit('keydown', ev);
    });

    this.emitter.once('quit', (code = 0) => {
      this.log('Bye~');
      return setTimeout(() => process.exit(code), 500);
    });
  }

  update(content: TerminalLine, row: number) {
    this.output?.update(content, row);
  }

  append(content: TerminalLine, refresh = true): void {
    this.output?.append(content, refresh);
  }

  log(...args: (TerminalLine | string)[]) {
    this.output?.log(...args);
  }

  insert(text: string) {
    this.input?.append(text);
  }

  tab(size: number, ...args: (TerminalLine | string)[]) {
    this.log([{ style: {}, content: '\t'.repeat(size) }], ...args);
  }

  setTip(tip: string) {
    this.output?.setTip(tip);
  }

  getTip() {
    return this.output?.getTip();
  }

  goTop() {
    this.output?.goTop();
  }

  clear() {
    this.output?.clear();
    this.input?.clear();
  }

  refresh(): void {
    this.screen?.render();
  }

  close(): void {
    this.screen?.destroy();
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
