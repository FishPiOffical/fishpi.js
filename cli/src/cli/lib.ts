import { Command } from 'commander';
import { FishPi } from '../cli';
import { ITerminalKeyEvent, Terminal, TerminalInputMode, TerminalLine } from './terminal';
import fs from 'fs';
import path from 'path';
import { resolve } from 'path';
export * from '../cli';

export class BaseCli {
  fishpi: FishPi;
  terminal: Terminal;
  candidate: Candidate;
  commands: ICommand[] = [];
  private eventCalls: any = {};

  constructor(fishpi: FishPi, terminal: Terminal) {
    this.fishpi = fishpi;
    this.terminal = terminal;
    this.candidate = new Candidate(terminal);
  }

  get version() {
    return JSON.parse(fs.readFileSync(resolve(__dirname, '../package.json'), 'utf-8')).version;
  }

  commander(program: Command): Promise<string> {
    return Promise.resolve('');
  }

  async load(...args: any): Promise<void> {
    this.terminal.on(
      'complete',
      (this.eventCalls.complete = (
        text: string,
        mode: string,
        callback: (val: string) => void,
      ): void => {
        if (mode == TerminalInputMode.CMD) {
          const command = this.commands.filter((c) =>
            c.commands.some((cmd) => cmd.startsWith(text)),
          );
          if (command.length == 0) {
            callback(command[0].commands[0] + ' ');
            this.candidate.setCandidates([]);
          } else if (this.candidate.isMatch(text)) {
            callback(this.candidate.data + ' ');
            this.candidate.setCandidates([]);
          } else {
            this.candidate.setCandidates(command.map((c) => c.commands[0]));
          }
        }
      }),
    );
  }

  async unload(): Promise<void> {
    this.terminal.off('complete', this.eventCalls.complete);
  }

  async log(...args: (string | TerminalLine)[]) {
    this.terminal.log(...args);
  }

  async command(cmd: string) {
    const cmds = cmd.trim().replace(/\s+/g, ' ').split(' ');
    if (cmds.length === 0) return;
    const command = this.commands.find((c) => c.commands.includes(cmds[0]));
    if (command) {
      command.call(...cmds.slice(1));
    } else {
      this.log(this.terminal.red.raw(`[未知命令]: ${cmds[0]}`));
    }
  }

  help() {
    this.log(this.terminal.blue.raw('可用指令：'));
    const maxLength =
      Math.max(...this.commands.map((cmd) => cmd.commands.join(' / ').length), 8) + 4;
    this.terminal.tab(1, this.terminal.yellow.raw(`help / h`.padEnd(maxLength)), '\t', '查看帮助');
    this.terminal.tab(1, this.terminal.yellow.raw(`exit / q`.padEnd(maxLength)), '\t', '返回首页');
    this.commands.forEach((cmd) => {
      const descriptions = cmd.description
        .split('\n')
        .map((d, i) => (i === 0 ? d : '\t' + ' '.repeat(maxLength) + '\t' + d));
      this.terminal.tab(
        1,
        this.terminal.yellow.raw(cmd.commands.join(' / ').padEnd(maxLength)),
        '\t',
        descriptions.join('\n'),
      );
    });
    this.log('');
  }

  helpText() {
    let helpText = '\n可用指令：\n';
    const maxLength = Math.max(...this.commands.map((cmd) => cmd.commands.join(' / ').length), 8);
    this.commands.forEach((cmd) => {
      const descriptions = cmd.description
        .split('\n')
        .map((d, i) => (i === 0 ? d : '  ' + ' '.repeat(maxLength) + '\t' + d));
      helpText += `  ${cmd.commands.join(' / ').padEnd(maxLength)}\t${descriptions.join('\n')}\n`;
    });
    return helpText;
  }
}

export class Candidate {
  terminal: Terminal;
  eventFn: Record<string, any> = {};
  candidates: string[] = [];
  currentCandidate: number = 0;
  listOffset: number = 0;
  prefix = '';

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  get data() {
    return this.candidates[this.currentCandidate] || '';
  }

  isMatch(text: string, ignoreCase: boolean = true) {
    if (!this.data) return false;
    if (text) return true;
    return ignoreCase
      ? this.data.toLowerCase().startsWith(text.toLowerCase())
      : this.data.startsWith(text);
  }

  async load() {
    this.terminal.on('keydown', (this.eventFn.key = this.onKeyDown.bind(this)));
  }

  async unload() {
    this.terminal.off('keydown', this.eventFn.key);
  }

  setCandidates(candidates: string[], prefix: string = '') {
    this.candidates = candidates;
    this.currentCandidate = 0;
    this.listOffset = 0;
    this.prefix = prefix;
    if (this.candidates.length) {
      this.renderCandidates(prefix);
    } else {
      this.terminal.setTip('');
    }
  }

  onKeyDown(key: ITerminalKeyEvent) {
    if (!['left', 'right', 'tab'].includes(key.full)) {
      this.setCandidates([]);
      return;
    }
    const size = this.candidates.length;
    if (size) {
      switch (key.full) {
        case 'left':
          this.currentCandidate = (this.currentCandidate - 1 + size) % size;
          break;
        case 'right':
          this.currentCandidate = (this.currentCandidate + 1) % size;
          break;
        case 'tab':
          return;
      }
      if (this.currentCandidate < this.listOffset) {
        this.listOffset = this.currentCandidate;
      } else if (this.currentCandidate > this.listOffset + 4) {
        this.listOffset = Math.max(0, this.currentCandidate - 4);
      }
      this.renderCandidates(this.prefix);
    }
  }

  renderCandidates(prefix: string) {
    this.terminal.setTip(
      this.candidates
        .slice(this.listOffset, this.listOffset + 5)
        .map((u, i) =>
          i == this.currentCandidate - this.listOffset
            ? this.terminal.Inverse.text(`${prefix}${u}`)
            : `${prefix}${u}`,
        )
        .join('\t') + (this.candidates.length > 5 ? `\t...` : ''),
    );
  }
}

export function searchFiles(filePath: string): string[] {
  const isDir = filePath.endsWith(path.sep);
  const fileDir = isDir ? filePath : path.dirname(filePath);
  if (!fs.existsSync(fileDir)) return [];
  const files = fs.readdirSync(fileDir);
  const baseName = isDir ? '' : path.basename(filePath);
  return files.filter(
    (f) => f.startsWith(baseName) && (baseName.startsWith('.') || !f.startsWith('.')),
  );
}

export interface ICommand {
  commands: string[];
  description: string;
  call: (...args: string[]) => void;
}
