import { Config } from './config';
import { ArticleListType, BaseCli, CommentPost, FishPi, IArticleComment, IArticleDetail } from './lib';
import { Terminal, TerminalInputMode } from './terminal';

export class ArticleCli extends BaseCli {
  currentList: IArticleDetail[] = [];
  currentPage: number = 1;
  currentPostId?: string;
  currentPostComments: IArticleComment[] = [];
  currentPostCommentPage = 1;
  me: string | undefined;
  
  constructor(fishpi: FishPi, terminal: Terminal) {
    super(fishpi, terminal);
    this.commands = [
      { commands: ['read', 'r'], description: '阅读文章，示例：r 0', call: this.read.bind(this) },
      { commands: ['next', 'n'], description: '下一页文章，在文章内则是下一页评论', call: this.next.bind(this) },
      { commands: ['prev', 'p'], description: '上一页文章，在文章内则是上一页评论', call: this.prev.bind(this) },
      { commands: ['vote', 'v'], description: '点赞文章', call: this.vote.bind(this) },
      { commands: ['reward', 'w'], description: '打赏文章', call: this.reward.bind(this) },
      { commands: ['thank', 't'], description: '感谢文章，加上序号则是感谢评论，示例：t 0', call: this.thank.bind(this) },
      { commands: ['comment', 'c'], description: '评论文章，加上序号则是回复评论，示例：c 这是一条评论，c 0 这是一条回复', call: this.comment.bind(this) },
      { commands: ['list', 'l'], description: '返回文章列表', call: this.list.bind(this) },
    ];
  }

  async load() {
    this.me = Config.get('username');
    this.renderList(1);
    super.load();
  }

  async unload() {
    super.unload();
  }

  renderList(page: number) {
    this.currentPostId = undefined;
    this.fishpi.article.list({ page, size: 10, type: ArticleListType.Recent }).then(res => {
      this.currentList = res.articles;
      this.currentPage = page;
      this.terminal.clear();
      this.terminal.log(
        this.terminal.Bold.blue.raw('文章列表'), 
        ` 第 ${page} 页 / 共 ${res.pagination.paginationPageCount} 页`
      );
      if (res.articles.length === 0) {
        this.terminal.log(this.terminal.gray.raw('没有更多文章了...'));
        return;
      }
      res.articles.forEach((article, i) => {
        const author = article.articleAuthor.userNickname || article.articleAuthor.userName + 
          (article.articleAuthor.userNickname ? `(${article.articleAuthor.userName})` : '');
        this.terminal.log(
          this.terminal.yellow.raw(i + '. '),
          '[',
          this.terminal.blue.raw(article.articleLatestCmtTimeStr),
          '] ',
          this.terminal.green.raw(author),
          ' - ',
          article.articleTitleEmoj,
        );
      });
      this.terminal.setTip(`输入 r <序号> 阅读, n 下一页, p 上一页, q 退出`);
      this.terminal.setInputMode(TerminalInputMode.CMD);
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
  }
  
  async help() {
    this.terminal.setInputMode(TerminalInputMode.CMD);
    this.terminal.clear();
    super.help();
  }

  read(index: string) {
    const oId = this.currentList[Number(index)]?.oId;
    if (!oId) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请输入正确的文章序号'));
      return;
    }
    this.currentPostId = oId;
    this.renderPost(oId);
  }

  next() {
    if (this.currentPostId) {
      this.renderPost(this.currentPostId, this.currentPostCommentPage + 1);
    } else {
      this.renderList(this.currentPage + 1);
    }
  }

  prev() {
    if (this.currentPostId) {
      if (this.currentPostCommentPage > 1) {
        this.renderPost(this.currentPostId, this.currentPostCommentPage - 1);
      }
    } else {
      if (this.currentPage > 1) {
        this.renderList(this.currentPage - 1);
      }
    }
  }

  vote() {
    if (!this.currentPostId) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请先查看文章再点赞'));
      return;
    }
    this.fishpi.article.vote(this.currentPostId, 'up').then(async () => {
      if (this.currentPostId) await this.renderPost(this.currentPostId, this.currentPostCommentPage);
      this.terminal.log(this.terminal.green.raw(`[成功]: 文章已点赞`));
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
  }

  reward() {
    if (!this.currentPostId) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请先查看文章再打赏'));
      return;
    }
    this.fishpi.article.reward(this.currentPostId).then(async () => {
      if (this.currentPostId) await this.renderPost(this.currentPostId, this.currentPostCommentPage);
      this.terminal.log(this.terminal.green.raw(`[成功]: 文章已打赏`));
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
  }

  thank(index: string) {
    if (index !== undefined) {
      return this.thankComment(index);
    }
    if (!this.currentPostId) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请先查看文章再感谢'));
      return;
    }
    this.fishpi.article.thank(this.currentPostId).then(async () => {
      if (this.currentPostId) await this.renderPost(this.currentPostId, this.currentPostCommentPage);
      this.terminal.log(this.terminal.green.raw(`[成功]: 文章已感谢`));
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
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
      this.terminal.log(this.terminal.red.raw('[错误]: 请先查看文章再评论'));
      return;
    }
    if (!content) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请输入评论内容'));
      return;
    }
    this.fishpi.comment.send(Object.assign(new CommentPost(), {
      articleId: this.currentPostId,
      commentContent: content,
    })).then(async () => {
      if (this.currentPostId) await this.renderPost(this.currentPostId, 1);
      this.terminal.log(this.terminal.green.raw(`[成功]: 评论已发布`));
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
  }

  reply(index: string, content: string) {
    if (!this.currentPostId) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请先查看文章再回复评论'));
      return;
    }
    const comment = this.currentPostComments[Number(index)];
    if (!comment) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请输入正确的评论序号'));
      return;
    }
    if (!content) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请输入回复内容'));
      return;
    }
    this.fishpi.comment.send(Object.assign(new CommentPost(), {
      articleId: this.currentPostId!,
      commentContent: content,
      commentOriginalCommentId: comment.oId,
    })).then(async () => {
      if (this.currentPostId) await this.renderPost(this.currentPostId, this.currentPostCommentPage);
      this.terminal.log(this.terminal.green.raw(`[成功]: 回复已发布`));
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
  }

  thankComment(index: string) {
    if (!this.currentPostId) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请先查看文章再感谢评论'));
      return;
    }
    const comment = this.currentPostComments[Number(index)];
    if (!comment) {
      this.terminal.log(this.terminal.red.raw('[错误]: 请输入正确的评论序号'));
      return;
    }
    this.fishpi.comment.thank(comment.oId).then(async () => {
      if (this.currentPostId) await this.renderPost(this.currentPostId, this.currentPostCommentPage);
      this.terminal.log(this.terminal.green.raw(`[成功]: 评论已感谢`));
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
  }

  list () {
    this.renderList(this.currentPage);
  }

  renderPost(oId: string, page = 1) {
    return this.fishpi.article.detail(oId, page).then(article => {
      this.currentPostCommentPage = page;
      this.currentPostComments = article.articleComments || [];
      this.terminal.clear();
      this.terminal.log(this.terminal.Bold.blue.raw(article.articleTitleEmoj));
      this.terminal.log(
        this.terminal.white.text('作者: '),
        this.terminal.green.raw(article.articleAuthor.userNickname || article.articleAuthor.userName),
        this.terminal.white.text(' 时间: '),
        this.terminal.blue.raw(article.timeAgo),
        this.terminal.white.text(`(👀: `) + 
        this.terminal.yellow.text(article.articleViewCount + ''),
        this.terminal.white.text(` ❤️️ : `) +
        this.terminal.yellow.text(article.thankedCnt + ''),
        this.terminal.white.text(`)`),
      );
      this.terminal.log(this.terminal.cyan.raw('='.repeat(this.terminal.info.width - 1)));
      this.terminal.log(article.articleOriginalContent || '');
      this.terminal.log(this.terminal.cyan.raw('='.repeat(this.terminal.info.width - 1)));
      if (article.articleRewardPoint) {
        this.terminal.log(this.terminal.Bold.yellow.raw('打赏区'), this.terminal.text(`(已打赏 ${article.rewardedCnt} / ${article.articleRewardPoint} 积分)`));
        if (article.rewarded) {
          this.terminal.log(this.filterContent(article.articleRewardContent || ''));
        } else {
          this.terminal.log(this.terminal.gray.raw('您还没有打赏，打赏后可见打赏内容'));
        }
        this.terminal.log(this.terminal.cyan.raw('='.repeat(this.terminal.info.width - 1)));
      }
      if (!article.articleComments?.length) {
        this.terminal.log(this.terminal.gray.raw('暂无评论'));
      } else {
        this.terminal.log(this.terminal.Bold.blue.raw('评论区'), this.terminal.text(`(${article.articleComments.length})`));
        article.articleComments.forEach((comment, i) => {
          const commenter = (comment.commenter.userNickname || comment.commenter.userName) + 
          (comment.commenter.userNickname ? `(${comment.commenter.userName})` : '');

          this.terminal.log(
            this.terminal.yellow.text(i + '. '),
            '[',
            this.terminal.blue.text(comment.timeAgo),
            '] ',
            '(👍:' +
            this.terminal.yellow.text(comment.commentGoodCnt + ''),
            ' ❤️️ :' +
            this.terminal.yellow.text(comment.rewardedCnt + ''),
            `)  ` + (comment.commentNice ? '🌟 ' : ''),
            this.terminal.green.text(commenter) + ': ',
            this.filterContent(comment.commentContent),
            '    '
          );
        });
      }
      this.terminal.setTip(`输入 n 下一页, p 上一页, v 点赞, w 打赏, t 感谢, c 评论, c <序号> 回复评论, t <序号> 感谢评论, l 返回列表`);
      this.terminal.setInputMode(TerminalInputMode.CMD);
    }).catch(err => {
      this.terminal.log(this.terminal.red.raw('[错误]: ' + err.message));
    });
  }

  filterContent(content: string) {
    content = (content.trim())
      .replace(/```(.*?)\n([\s\S]*?)```/g, '{inverse}$1\n$2{/inverse}') // ``` 代码块 ```
      .replace(/`(.*?)`/g, '{inverse}$1{/inverse}')
      .replace(/\*\*(.*?)\*\*/g, '{bold}$1{/bold}')               // **加粗**
      .replace(/__(.*?)__/g, '{bold}$1{/bold}')                   // __加粗__
      .replace(/\*(.*?)\*/g, '{underline}$1{/underline}')         // *下划线*
      .replace(/_(.*?)_/g, '{underline}$1{/underline}')           // _下划线_
      .replace(/\[↩\]\([^)]*?\)/g, '')                           // 过滤引用来源
      .replaceAll(`@${this.me}`, `{bold}{yellow-fg}@${this.me}{/}{/}`) // 高亮@自己
      .replace(/@([^<]*?)( |$)/gm, '{green-fg}@$1$2{/}')             // 高亮@别人
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
