# Fishpi.js

摸鱼派社区 (https://fishpi.cn/) 的 API Package，可以快速开发出一款应用支援社区功能。

## 功能
- 用户信息；
- 聊天室；
  - 话题编辑；
  - 红包收发；
- 自定义表情包；
- 文件上传；
- 通知信息；
- 清风明月；
- 文章读写；
- 评论点赞；
- 私聊功能；

## 安装

```bash
npm install fishpi
```

## 用例

```ts
import FishPi from 'fishpi';

// 登录获取 apiKey
let apiKey = '';
let fish = new FishPi();
let rsp = await fish.login({ 
    username: 'username', 
    passwd: 'password123456' 
});
if (rsp.code == 0) apiKey = rsp.Key;

// 通过 apiKey 获取登录用户信息
let fish = new FishPi(apiKey);
console.dir(await fish.account.info());

// 获取用户自定义表情包
let emojis = await fish.emoji.get();
// 获取默认表情包
let defaultEmoji = fish.emoji.default;

// 监听聊天室消息
fish.chatroom.on('msg', (msg) => console.dir(msg));
// 向聊天室发送信息（需要登录）
await fish.chatroom.send('Hello World!');
// 向聊天室发送红包
await fish.chatroom.redpacket.send({
    type: 'random';
    money: 32;
    count: 2;
    msg: '摸鱼者，事竟成！';
    recivers: [];
})

// 私聊历史获取
let chatHistory = await fish.chat.get({ user: 'username', autoRead: false })
// 监听私聊新消息
fishpi.notice.on('newIdleChatMessage', (msg: NoticeMsg) => {
    console.log(msg.senderUserName, '说：', msg.preview);
});
// 监听指定用户的私聊消息
fishpi.chat.channel('username').on('data', (msg: ChatData) => {
    console.log(msg.senderUserName, '[', msg.time, ']：', msg.content);
);
// 给指定用户发私聊消息
fishpi.chat.channel('username').send('Hi~');

// 金手指
import { Finger, FingerTo } from 'fishpi';

// 一次性金手指
await FingerTo('GoldenFingerKey').queryLatestLoginIP('username')

// 金手指实例
const finger = new Finger(apiKey);
await finger.queryLatestLoginIP('username');

```

## 注意事项

API 库使用 `fetch` 做 API 请求，浏览器环境可以直接使用。在 Node 环境需要安装 `node-fetch` 2.x 版本的库。执行如下代码设置 `fetch` 函数：
```typescript
import fetch from 'node-fetch'
globalThis.fetch = fetch as any;
```

## 命令行工具

全局安装可以直接通过 `fishpi` 执行一个摸鱼派命令行工具，包含几乎所有功能。

```
npm i -g fishpi
```