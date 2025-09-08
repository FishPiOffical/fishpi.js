import { FishPi } from '..';
import { Terminal, TerminalInputMode, TerminalLine } from './terminal';

export * from '..';
export { default as FishPi } from '..';

export class BaseCli {
  fishpi: FishPi;
  terminal: Terminal;
  commands: ICommand[] = [];
  private eventCalls: any = {};
  
  constructor(fishpi: FishPi, terminal: Terminal) {
    this.fishpi = fishpi;
    this.terminal = terminal;
  }

  async load(...args: any): Promise<void> {
    this.terminal.on('complete', this.eventCalls.complete = (text: string, mode: string, callback: (val: string) => void): void => {
      if (mode == TerminalInputMode.CMD) {
        const command = this.commands.find(c => c.commands.some(cmd => cmd.startsWith(text)));
        if (command) {
          callback(command.commands[0] + ' ');
        }
      }
    })
  }

  async unload(): Promise<void> {
    this.terminal.off('complete', this.eventCalls.complete);
  }

  async log(...args: (string | TerminalLine)[]) {
    this.terminal.log(...args);
  }

  async command(cmd: string) {
    const cmds = cmd.trim().replace(/\s+/, ' ').split(' ');
    if (cmds.length === 0) return;
    const command = this.commands.find(c => c.commands.includes(cmds[0]));
    if (command) {
      command.call(...cmds.slice(1));
    } else {
      this.terminal.log(this.terminal.red.raw(`[未知命令]: ${cmds[0]}`));
    }
  }

  help() {
    this.terminal.log(this.terminal.blue.raw('可用指令：'));
    const maxLength = Math.max(...this.commands.map(cmd => cmd.commands.join(' / ').length), 8) + 4;
    this.terminal.tab(1, this.terminal.yellow.raw(`help / h`.padEnd(maxLength)), '\t', '查看帮助');
    this.terminal.tab(1, this.terminal.yellow.raw(`exit / q`.padEnd(maxLength)), '\t', '返回首页');
    this.commands.forEach(cmd => {
      const descriptions = cmd.description.split('\n').map((d, i) => (i === 0 ? d : '\t' + ' '.repeat(maxLength) + '\t' + d));
      this.terminal.tab(1, this.terminal.yellow.raw(cmd.commands.join(' / ').padEnd(maxLength)), '\t', descriptions.join('\n'));
    });
    this.terminal.log('');
  }
}

export interface ICommand {
  commands: string[];
  description: string;
  call: (...args: string[]) => void;
}
