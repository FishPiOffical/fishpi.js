import { Terminal, Config, AccountCli, ChatRoomCli } from './cli/index';
import { FishPi } from './cli/lib';

async function main() {
  Config.load();

  const terminal = new Terminal();
  const fishpi = new FishPi();

  const account = new AccountCli(fishpi, terminal);
  const isLoggedIn = await account.isLogin();
  if (!isLoggedIn) {
    console.log('您尚未登录，请先登录！');
  }
  if (!isLoggedIn && !(await account.login())) {
    return;
  }

  terminal.refresh();
  terminal.log('欢迎您~', terminal.Bold.cyan.text(account.me?.userNickname));
  const chatroom = new ChatRoomCli(fishpi, terminal);
  chatroom.load();
}

main().catch(console.error);
