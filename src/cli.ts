import { Config, Page, Terminal } from './cli/index';
import { FishPi } from './cli/lib';

async function main() {
  Config.load();

  const terminal = new Terminal();
  const fishpi = new FishPi();
  const page = new Page(terminal, fishpi);

  if (!await page.init()) return;

  await page.load();
}

main().catch(console.error);
