import {
  BaseCli,
  FishPi,
  INoticeAt,
  INoticeComment,
  INoticeArticle,
  INoticePoint,
  INoticeUnReadCount,
  NoticeType,
  INoticeSystem,
} from './lib';
import { Terminal, TerminalInputMode } from './terminal';

const noticeName = {
  point: '积分',
  commented: '评论',
  reply: '回复',
  at: '提及我的',
  following: '我关注的',
  broadcast: '同城',
  'sys-announce': '系统',
};

export class NoticeCli extends BaseCli {
  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.commands = [
      {
        commands: ['unread', 'u'],
        description: '查看未读通知数',
        call: this.render.bind(this),
      },
      {
        commands: ['read', 'r'],
        description: `标记通知为已读，示例：read at，类型不传则全部标记已读。`,
        call: this.read.bind(this),
      },
      {
        commands: ['list', 'l'],
        description: `查看通知列表，示例：l at`,
        call: this.list.bind(this),
      },
    ];
  }

  addListener() {
    this.fishpi.notice.on('refreshNotification', this.notify.bind(this));
    this.fishpi.notice.on('chatUnreadCountRefresh', this.notify.bind(this));
  }

  async load() {
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    this.terminal.setTip(
      'list <类型> - 查看通知，unread - 查看未读消息，read [类型] - 标记为已读，类型不传则全部标记已读，help - 帮助，exit - 退出',
    );
    this.render();
    super.load();
  }

  async unload() {
    super.unload();
  }

  async help() {
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    super.help();
    this.log('');
    this.log(
      this.terminal.Bold.yellow.text('通知类型'),
      ': ',
      Object.keys(noticeName)
        .map((n) => `${n}(${noticeName[n as NoticeType]})`)
        .join(', '),
    );
  }

  async render() {
    const unread = await this.fishpi.notice.count();
    this.terminal.clear();
    this.log(
      this.terminal.Bold.green.raw('未读通知'),
      unread.unreadNotificationCnt
        ? this.terminal.red.raw(` (${unread.unreadNotificationCnt})`)
        : '',
    );
    if (unread.unreadCommentedNotificationCnt)
      this.log(
        this.terminal.blue.raw('收到回贴'),
        '(comment): ' + unread.unreadCommentedNotificationCnt,
      );
    if (unread.unreadReplyNotificationCnt)
      this.log(this.terminal.blue.raw('收到回复'), '(reply): ' + unread.unreadReplyNotificationCnt);
    if (unread.unreadAtNotificationCnt)
      this.log(this.terminal.blue.raw('提及我的'), '(at): ' + unread.unreadAtNotificationCnt);
    if (unread.unreadFollowingNotificationCnt)
      this.log(
        this.terminal.blue.raw('我关注的'),
        '(following): ' + unread.unreadFollowingNotificationCnt,
      );
    if (unread.unreadPointNotificationCnt)
      this.log(this.terminal.blue.raw('积分通知'), '(point): ' + unread.unreadPointNotificationCnt);
    if (unread.unreadBroadcastNotificationCnt)
      this.log(
        this.terminal.blue.raw('同城通知'),
        '(broadcast): ' + unread.unreadBroadcastNotificationCnt,
      );
    if (unread.unreadSysAnnounceNotificationCnt)
      this.log(
        this.terminal.blue.raw('系统通知'),
        '(sys-announce): ' + unread.unreadSysAnnounceNotificationCnt,
      );

    if (!unread.unreadNotificationCnt) {
      this.log(this.terminal.yellow.raw('暂无新通知'));
    }

    this.log('');
    if (unread.unreadNewFollowerNotificationCnt) {
      this.log(
        this.terminal.blue.Inverse.raw(`有${unread.unreadNewFollowerNotificationCnt}新的关注者`),
      );
    }
  }

  async read(type = '') {
    if (type && !Object.values(NoticeType).includes(type as NoticeType)) {
      this.log(this.terminal.red.raw('[错误]: 无效的通知类型'));
      this.log(
        '可用的通知类型：',
        Object.keys(noticeName)
          .map((n) => `${n}(${noticeName[n as NoticeType]})`)
          .join(', '),
      );
      return;
    }
    try {
      if (!type) await this.fishpi.notice.readAll();
      else await this.fishpi.notice.makeRead(type as NoticeType);
      this.render();
    } catch (err) {
      this.log(this.terminal.red.raw('[错误]: ' + (err as Error).message));
    }
  }

  list(type: string) {
    if (!Object.values(NoticeType).includes(type as NoticeType)) {
      this.log(this.terminal.red.raw('[错误]: 无效的通知类型'));
      this.log(
        '可用的通知类型：',
        Object.keys(noticeName)
          .map((n) => `${n}(${noticeName[n as NoticeType]})`)
          .join(', '),
      );
      return;
    }
    this.fishpi.notice.list(type as NoticeType).then((notices) => {
      this.terminal.clear();
      this.log(
        this.terminal.Bold.green.raw('通知列表'),
        this.terminal.gray.raw(` (${noticeName[type as NoticeType]})`),
      );
      this.log('');
      if (type === NoticeType.Comment || type === NoticeType.Reply) {
        this.renderComment(notices as INoticeComment[]);
      } else if (type === NoticeType.Following || type === NoticeType.Broadcast) {
        this.renderArticle(notices as INoticeArticle[]);
      } else {
        this.renderNotice(notices as (INoticeAt | INoticePoint | INoticeSystem)[]);
      }
    });
  }

  renderNotice(list: (INoticeAt | INoticePoint | INoticeSystem)[]) {
    [...list].reverse().forEach((notice, i) => {
      this.log(
        this.terminal.yellow.raw(`${list.length - i - 1}. `),
        '[',
        notice.hasRead ? this.terminal.green.raw('已读') : this.terminal.red.raw('未读'),
        '] ',
        this.terminal.blue.raw(
          notice.description
            .replace(/<\/*[^>]*?>/g, '')
            .replace(/\s+/g, ' ')
            .trim(),
        ),
      );
    });
  }

  renderComment(list: INoticeComment[]) {
    [...list].reverse().forEach((comment, i) => {
      this.log(
        this.terminal.yellow.raw(`${list.length - i - 1}. `),
        '[',
        comment.hasRead ? this.terminal.green.raw('已读') : this.terminal.red.raw('未读'),
        '] ',
        this.terminal.Bold.blue.raw(comment.commentArticleTitle),
        ' - ',
        comment.commentContent
          .replace(/<\/*[^>]*?>/g, '')
          .replace(/\s+/g, ' ')
          .trim(),
      );
    });
  }

  renderArticle(list: INoticeArticle[]) {
    [...list].reverse().forEach((follow, i) => {
      this.log(
        this.terminal.yellow.raw(`${list.length - i - 1}. `),
        '[',
        follow.hasRead ? this.terminal.green.raw('已读') : this.terminal.red.raw('未读'),
        '] ',
        follow.articleTitle,
      );
    });
  }

  notify(notice: INoticeUnReadCount) {
    let content = '';
    if (notice.command == 'refreshNotification') {
      content = `收到一条新通知`;
    }
    if (notice.command == 'chatUnreadCountRefresh') {
      content = `收到一条私信`;
    }
    this.terminal.setTip(this.terminal.Bold.green.text(`[${content}]`));
  }
}
