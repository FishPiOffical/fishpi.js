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

  async load(_params: any): Promise<void> {
    // Load the CLI with the given parameters
  }

  async unload(): Promise<void> {
    // Unload the CLI
  }

  async log(...args: string[]) {
    this.terminal.log(...args);
  }
}
