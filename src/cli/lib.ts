import { FishPi } from '..';
import { Terminal } from './terminal';

export * from '..';
export { default as FishPi } from '..';

export class BaseCli {
  fishpi: FishPi;
  terminal: Terminal;
  
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

  async log(...args: string[]) {
    this.terminal.log(...args);
  }

  help() {
    this.terminal.log('帮助信息：');
  }
}
