# Fishpi CLI

摸鱼派社区 (https://fishpi.cn/) 的命令行工具，支援社区所有功能。

## 功能
```bash
Usage: Fishpi CLI [options] [command]

CLI for Fishpi (https://fishpi.cn)

Options:
  -V, --version               版本号
  -h, --help                  帮助

Commands:
  login [options] [username]     登录/切换账号
  chatroom [commands...]         启动并进入聊天室，可传递参数执行子命令
  chat [commands...]             启动并进入私聊，可传递参数执行子命令
  article [commands...]          启动并进入文章，可传递参数执行子命令
  breezemoon [commands...]       启动并进入清风明月，可传递参数执行子命令
  notice [commands...]           启动并进入通知，可传递参数执行子命令
  account [commands...]          启动并进入个人页，可传递参数执行子命令
  redpacket [options] <message>  发送红包
  post [options] <file>          发布文章
  help [command]                 查看指定命令帮助
```

## 安装

```bash
npm install fishpi-cli -g
```