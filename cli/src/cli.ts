import { Command } from 'commander';
import { Config, Page, Terminal } from './cli/index';
import { FishPi } from '.';
import path from 'path';
export * from '.';
const program = new Command();

async function main() {
  Config.load();

  if (!globalThis.fetch) {
    globalThis.fetch = (await import('node-fetch')).default as any;
  }

  const terminal = new Terminal();
  const fishpi = new FishPi();
  const page = new Page(terminal, fishpi);

  program
    .name('Fishpi CLI')
    .description('CLI for Fishpi (https://fishpi.cn)')
    .version(page.version);
  page.command(program);

  const filename = path.basename(__filename);
  const hasCommand =
    process.argv.findIndex((arg) => arg.endsWith(filename) || arg.endsWith(page.bin)) <
    process.argv.length - 1;
  if (hasCommand) program.parse();

  if (!(await page.init())) return;

  await page.load();
}

main().catch(console.error);
