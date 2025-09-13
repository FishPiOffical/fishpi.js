import { Command } from 'commander';
import { Config } from './config';
import {
  ArticleListType,
  BaseCli,
  FishPi,
  ArticleComment,
  ArticleDetail,
  ArticleList,
} from './lib';
import { Terminal, TerminalInputMode } from './terminal';
import { readFileSync } from 'fs';

export class ArticleCli extends BaseCli {
  currentList: ArticleDetail[] = [];
  currentPage: number = 1;
  currentPostId?: string;
  currentPostComments: ArticleComment[] = [];
  currentPostCommentPage = 1;
  tag = '';
  user = '';
  me: string | undefined;

  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.commands = [
      {
        commands: ['article', 'a'],
        description: '查看文章列表，传递用户名可查看指定用户的文章，示例：a imlinhanchao',
        call: this.load.bind(this),
      },
      {
        commands: ['list', 'l'],
        description: '返回文章列表，仅在文章内有效',
        call: this.list.bind(this),
      },
      {
        commands: ['tag', 'g'],
        description: '按标签查看文章，示例：tag 前端',
        call: this.tagArticles.bind(this),
      },
      {
        commands: ['next', 'n'],
        description: '下一页文章，在文章内则是下一页评论',
        call: this.next.bind(this),
      },
      {
        commands: ['prev', 'p'],
        description: '上一页文章，在文章内则是上一页评论',
        call: this.prev.bind(this),
      },
      { commands: ['vote', 'v'], description: '点赞文章', call: this.vote.bind(this) },
      { commands: ['reward', 'w'], description: '打赏文章', call: this.reward.bind(this) },
      {
        commands: ['thank', 't'],
        description: '感谢文章，加上序号则是感谢评论，示例：t 0',
        call: this.thank.bind(this),
      },
      {
        commands: ['comment', 'c'],
        description: '评论文章，加上序号则是回复评论，示例：c 这是一条评论，c 0 这是一条回复',
        call: this.comment.bind(this),
      },
    ];
  }

  async load(user: string = '') {
    this.me = Config.get('username');
    await super.load();
    if (user == '.') user = this.me || '';
    if (user) {
      await this.renderUser(1, user);
    } else {
      await this.renderRecent(1);
    }
  }

  async unload() {
    super.unload();
  }

  async list() {
    if (this.user) {
      return this.renderUser(this.currentPage, this.user);
    } else {
      return this.renderRecent(this.currentPage, this.tag);
    }
  }

  commander(program: Command): Promise<string> {
    return new Promise((resolve) =>
      program
        .command('post')
        .alias('pt')
        .description('发布文章')
        .argument('<file>', '文章文件路径，文件内容支持 Markdown')
        .requiredOption('-t, --title <title>', '文章标题')
        .requiredOption('--tags <tags>', '文章标签，多个标签用逗号分隔')
        .option(
          '--type <type>',
          '文章类型，normal 普通文章，private 机要，broadcast 同城广播，qna 问答',
          (v) => v.match(/^(normal|private|broadcast|qna)$/)?.[0],
          'normal',
        )
        .option('-c, --commentable', '是否允许评论', true)
        .option('--show', '是否在文章列表显示', true)
        .option('--notify', '是否通知帖子关注者', false)
        .option('--anonymous', '是否匿名发布', false)
        .option('--offer <point>', '悬赏积分，若 type 为 qna 则必填', (v) => Number(v))
        .option('--reward <point>', '开启打赏，需传递大于 0 的数字', (v) => Number(v))
        .option('--reward-content <content>', '打赏内容，若开启打赏则必填')
        .action(async (file, options) => {
          const content = readFileSync(file, 'utf-8');
          const articleType: any = {
            normal: 0,
            private: 1,
            broadcast: 2,
            qna: 5,
          };
          if (options.type == 'qna' && !options.offer) {
            console.error('error: 问答文章必须设置悬赏积分！');
            process.exit(1);
          }
          if (options.reward) {
            const rewardPoint = Number(options.reward);
            if (isNaN(rewardPoint) || rewardPoint <= 0) {
              console.error('error: 打赏积分必须是大于0的数字！');
              process.exit(1);
            }
            if (!options.rewardContent) {
              console.error('error: 打赏内容不能为空！');
              process.exit(1);
            }
          }
          if (options.rewardContent && !options.reward) {
            console.error('error: 打赏内容必须设置打赏积分！');
            process.exit(1);
          }
          this.fishpi.article.post({
            title: options.title,
            content,
            tags: options.tags
              .split(',')
              .map((t: string) => t.trim())
              .filter((t: string) => t),
            type: articleType[options.type] ?? 0,
            rewardPoint: options.reward ? Number(options.reward[0]) : undefined,
            rewardContent: options.reward ? options.reward[1] : undefined,
            offerPoint: options.offer ? Number(options.offer) : undefined,
            commentable: options.commentable,
            isShowInList: options.show,
            isNotifyFollowers: options.notify,
            isAnonymous: options.anonymous,
          });
          resolve('a .');
        }),
    );
  }

  tagArticles(tag: string) {
    if (!tag) {
      return this.log(this.terminal.red.raw('[错误]: 请输入标签名称'));
    }
    this.tag = tag;
    this.renderRecent(1, tag);
  }

  renderUser(page: number, userName: string = '') {
    this.currentPostId = undefined;
    this.user = userName;
    const size = this.terminal.info.height - 3;
    return this.fishpi.article
      .userArticles({ page, userName, size })
      .then((res) => {
        this.currentPage = page;
        this.renderArticles(res);
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  renderRecent(page: number, tag: string = '') {
    this.currentPostId = undefined;
    const size = this.terminal.info.height - 3;
    return this.fishpi.article
      .list({ page, size, type: ArticleListType.Recent, tag })
      .then((res) => {
        this.user = '';
        this.tag = tag;
        this.currentPage = page;
        this.renderArticles(res);
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  renderArticles(res: ArticleList) {
    this.currentList = res.articles;
    this.terminal.clear();
    this.log(
      this.terminal.Bold.blue.raw('文章列表'),
      this.user ? ' - ' + this.terminal.green.text(`${this.user}`) : '',
      this.tag ? ' - ' + this.terminal.cyan.text(`#${this.tag}`) : '',
      ` 第 ${this.currentPage} 页 / 共 ${res.pagination.pageCount} 页`,
    );
    if (res.articles.length === 0) {
      this.log(this.terminal.white.raw('没有更多文章了...'));
      return;
    }
    res.articles.forEach((article, i) => {
      const author =
        article.author.nickname ||
        article.author.userName + (article.author.nickname ? `(${article.author.userName})` : '');
      this.log(
        this.terminal.yellow.raw(i + '. '),
        '[',
        this.terminal.blue.raw(article.latestCmtTime),
        '] ',
        this.terminal.green.raw(author),
        ' - ',
        article.titleEmoj,
      );
    });
    this.terminal.setTip(`输入 <序号/Id> 阅读, n 下一页, p 上一页, q 退出`);
    this.terminal.setInputMode(TerminalInputMode.CMD);
  }

  async help() {
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    super.help();
  }

  async command(cmd: string) {
    if (this.currentPostId) return super.command(cmd);
    const cmds = cmd.trim().replace(/\s+/g, ' ').split(' ');
    if (!isNaN(Number(cmds[0]))) this.read(cmds[0]);
    else return super.command(cmd);
  }

  async read(cmd: string) {
    const index = Number(cmd);
    let oId = '';
    if (index < this.currentList.length) {
      oId = this.currentList[index]?.oId;
    } else if (cmd.length == 13) {
      oId = cmd;
    } else {
      this.log(this.terminal.red.raw('[错误]: 请输入正确的文章序号或Id'));
      return;
    }
    this.currentPostId = oId;
    await this.renderPost(oId);
  }

  next() {
    if (this.currentPostId) {
      this.renderPost(this.currentPostId, this.currentPostCommentPage + 1);
    } else if (this.user) {
      this.renderUser(this.currentPage + 1, this.user);
    } else {
      this.renderRecent(this.currentPage + 1, this.tag);
    }
  }

  prev() {
    if (this.currentPostId) {
      if (this.currentPostCommentPage > 1) {
        this.renderPost(this.currentPostId, this.currentPostCommentPage - 1);
      }
    } else if (this.user) {
      if (this.currentPage > 1) {
        this.renderUser(this.currentPage - 1, this.user);
      }
    } else {
      if (this.currentPage > 1) {
        this.renderRecent(this.currentPage - 1, this.tag);
      }
    }
  }

  vote() {
    if (!this.currentPostId) {
      this.log(this.terminal.red.raw('[错误]: 请先查看文章再点赞'));
      return;
    }
    this.fishpi.article
      .vote(this.currentPostId, 'up')
      .then(async () => {
        if (this.currentPostId)
          await this.renderPost(this.currentPostId, this.currentPostCommentPage);
        this.log(this.terminal.green.raw(`[成功]: 文章已点赞`));
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  reward() {
    if (!this.currentPostId) {
      this.log(this.terminal.red.raw('[错误]: 请先查看文章再打赏'));
      return;
    }
    this.fishpi.article
      .reward(this.currentPostId)
      .then(async () => {
        if (this.currentPostId)
          await this.renderPost(this.currentPostId, this.currentPostCommentPage);
        this.log(this.terminal.green.raw(`[成功]: 文章已打赏`));
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  thank(index: string) {
    if (index !== undefined) {
      return this.thankComment(index);
    }
    if (!this.currentPostId) {
      this.log(this.terminal.red.raw('[错误]: 请先查看文章再感谢'));
      return;
    }
    this.fishpi.article
      .thank(this.currentPostId)
      .then(async () => {
        if (this.currentPostId)
          await this.renderPost(this.currentPostId, this.currentPostCommentPage);
        this.log(this.terminal.green.raw(`[成功]: 文章已感谢`));
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  comment(...contents: string[]) {
    let content = contents.join(' ');
    if (!isNaN(Number(contents[0])) && contents.length > 1) {
      const index = contents.shift();
      content = contents.join(' ');
      return this.reply(index!, content);
    }
    if (!this.currentPostId) {
      this.log(this.terminal.red.raw('[错误]: 请先查看文章再评论'));
      return;
    }
    if (!content) {
      this.log(this.terminal.red.raw('[错误]: 请输入评论内容'));
      return;
    }
    this.fishpi.comment
      .send({
        articleId: this.currentPostId,
        content: content,
      })
      .then(async () => {
        if (this.currentPostId) await this.renderPost(this.currentPostId, 1);
        this.log(this.terminal.green.raw(`[成功]: 评论已发布`));
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  reply(index: string, content: string) {
    if (!this.currentPostId) {
      this.log(this.terminal.red.raw('[错误]: 请先查看文章再回复评论'));
      return;
    }
    const comment = this.currentPostComments[Number(index)];
    if (!comment) {
      this.log(this.terminal.red.raw('[错误]: 请输入正确的评论序号'));
      return;
    }
    if (!content) {
      this.log(this.terminal.red.raw('[错误]: 请输入回复内容'));
      return;
    }
    this.fishpi.comment
      .send({
        articleId: this.currentPostId!,
        content: content,
        originalId: comment.oId,
      })
      .then(async () => {
        if (this.currentPostId)
          await this.renderPost(this.currentPostId, this.currentPostCommentPage);
        this.log(this.terminal.green.raw(`[成功]: 回复已发布`));
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  thankComment(index: string) {
    if (!this.currentPostId) {
      this.log(this.terminal.red.raw('[错误]: 请先查看文章再感谢评论'));
      return;
    }
    const comment = this.currentPostComments[Number(index)];
    if (!comment) {
      this.log(this.terminal.red.raw('[错误]: 请输入正确的评论序号'));
      return;
    }
    this.fishpi.comment
      .thank(comment.oId)
      .then(async () => {
        if (this.currentPostId)
          await this.renderPost(this.currentPostId, this.currentPostCommentPage);
        this.log(this.terminal.green.raw(`[成功]: 评论已感谢`));
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  renderPost(oId: string, page = 1) {
    return this.fishpi.article
      .detail(oId, page)
      .then((article) => {
        this.currentPostCommentPage = page;
        this.currentPostComments = article.comments || [];
        this.terminal.clear();
        this.log(article.isPerfect ? '✨' : '', this.terminal.Bold.blue.raw(article.titleEmoj));
        this.log(
          this.terminal.white.text('作者: '),
          this.terminal.green.raw(article.author.nickname || article.author.userName),
          this.terminal.white.text(' 时间: '),
          this.terminal.blue.raw(article.timeAgo),
          this.terminal.white.text(` ( 👀: `) + this.terminal.yellow.text(article.viewCount + ''),
          this.terminal.white.text(` ❤️️ : `) + this.terminal.yellow.text(article.thankedCnt + ''),
          this.terminal.white.text(` ️👍: `) + this.terminal.yellow.text(article.goodCnt + ''),
          article.isOffered ? ` 💰: ${this.terminal.yellow.text(article.offerPoint + '')}` : '',
          this.terminal.white.text(` )`),
        );
        this.log(this.terminal.cyan.raw('='.repeat(this.terminal.info.width - 1)));
        this.log(article.originalContent || '');
        this.log(
          ...article.tags.map((tag) => this.terminal.blue.Inverse.text(`#${tag.title}`) + ' '),
        );
        this.log(this.terminal.cyan.raw('='.repeat(this.terminal.info.width - 1)));
        if (article.rewardPoint) {
          this.log(
            this.terminal.Bold.yellow.raw('打赏区'),
            this.terminal.text(`(已打赏 ${article.rewardedCnt} / ${article.rewardPoint} 积分)`),
          );
          if (article.isRewarded) {
            this.log(this.filterContent(article.rewardContent || ''));
          } else {
            this.log(this.terminal.white.raw('您还没有打赏，打赏后可见打赏内容'));
          }
          this.log(this.terminal.cyan.raw('='.repeat(this.terminal.info.width - 1)));
        }
        if (!article.comments?.length) {
          this.log(this.terminal.white.raw('暂无评论'));
        } else {
          this.log(
            this.terminal.Bold.blue.raw('💬 评论区 '),
            this.terminal.text(`(${article.comments.length})`),
          );
          article.comments.forEach((comment, i) => {
            const commenter =
              (comment.commenter.nickname || comment.commenter.userName) +
              (comment.commenter.nickname ? `(${comment.commenter.userName})` : '');

            this.log(
              this.terminal.yellow.text(i + '. '),
              '[',
              this.terminal.blue.text(comment.timeAgo),
              '] ',
              '(👍:' + this.terminal.yellow.text(comment.goodCnt + ''),
              ' ❤️️ :' + this.terminal.yellow.text(comment.rewardedCnt + ''),
              `)  ` + (comment.isNice ? '🌟 ' : ''),
              this.terminal.green.text(commenter) + ': ',
              this.filterContent(comment.content),
              '    ',
            );
          });
        }
        this.terminal.setTip(
          `输入 n 下一页, p 上一页, v 点赞, w 打赏, t 感谢, c 评论, c <序号> 回复评论, t <序号> 感谢评论, l 返回列表`,
        );
        this.terminal.setInputMode(TerminalInputMode.CMD);
        setTimeout(() => this.terminal.goTop(), 10);
      })
      .catch((err) => {
        this.log(this.terminal.red.raw('[错误]: ' + err.message));
      });
  }

  filterContent(content: string) {
    content = content
      .trim()
      .replace(/```(.*?)\n([\s\S]*?)```/g, '{inverse}$1\n$2{/inverse}') // ``` 代码块 ```
      .replace(/`(.*?)`/g, '{inverse}$1{/inverse}')
      .replace(/\*\*(.*?)\*\*/g, '{bold}$1{/bold}') // **加粗**
      .replace(/__(.*?)__/g, '{bold}$1{/bold}') // __加粗__
      .replace(/\*(.*?)\*/g, '{underline}$1{/underline}') // *下划线*
      .replace(/_(.*?)_/g, '{underline}$1{/underline}') // _下划线_
      .replace(/\[↩\]\([^)]*?\)/g, '') // 过滤引用来源
      .replaceAll(`@${this.me}`, `{bold}{yellow-fg}@${this.me}{/}{/}`) // 高亮@自己
      .replace(/@([^<]*?)( |$)/gm, '{green-fg}@$1$2{/}') // 高亮@别人
      .replace(/<img\s+src="([^"]*?)"\s+alt="图片表情"([^>]*?>)/g, '[动画表情]')
      .replace(/<audio[^>]*?>.*?<\/audio>/g, '[音频]')
      .replace(/<video[^>]*?>.*?<\/video>/g, '[视频]')
      .replace(/<iframe[^>]*?src="([^"]*?)"[^>]*?>.*?<\/iframe>/g, '[内联网页]($1)')
      .replace(/<img\s+src="([^"]*?)"\s+([^>]*?>)/g, '[图片]($1)')
      .replace(/<(\w+)>(.*?)<\/\1>/gm, '$2')
      .replace(/<br>/, '')
      .trim();
    return content;
  }
}
