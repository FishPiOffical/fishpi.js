import { FishPi } from '..';
import { Terminal, TerminalLine } from './terminal';

export * from '..';
export { default as FishPi } from '..';

export class BaseCli {
  fishpi: FishPi;
  terminal: Terminal;
  commands: ICommand[] = [];
  
  constructor(fishpi: FishPi, terminal: Terminal) {
    this.fishpi = fishpi;
    this.terminal = terminal;
  }

  async load(...args: any): Promise<void> {
    // Load the CLI with the given parameters
  }

  async unload(): Promise<void> {
    // Unload the CLI
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
    this.terminal.log('帮助信息：');
  }
}

export interface ICommand {
  commands: string[];
  call: (...args: string[]) => void;
}
