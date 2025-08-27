import { request, domain } from './utils';

export class Emoji {
  private _apiKey: string = '';
  private _emojis: string[] = [];

  constructor(token: string = '') {
    if (!token) {
      return;
    }
    this.setToken(token);
  }

  /**
   * 重新设置请求 Token
   * @param apiKey 接口 API Key
   */
  setToken(token: string) {
    this._apiKey = token;
    if (token)
      this.get()
        .then((e) => (this._emojis = e))
        .catch(() => {});
  }

  get default() {
    return {
      doge: 'https://cdn.jsdelivr.net/npm/vditor@3.8.7/dist/images/emoji/doge.png',
      trollface: 'https://cdn.jsdelivr.net/npm/vditor@3.8.7/dist/images/emoji/trollface.png',
      huaji: 'https://cdn.jsdelivr.net/npm/vditor@3.8.7/dist/images/emoji/huaji.gif',
      octocat: 'https://cdn.jsdelivr.net/npm/vditor@3.8.7/dist/images/emoji/octocat.png',
      wulian: 'https://cdn.jsdelivr.net/npm/vditor@3.8.7/dist/images/emoji/wulian.png',
      smile: `https://file.${domain}/emoji/graphics/smile.png`,
      laughing: `https://file.${domain}/emoji/graphics/laughing.png`,
      blush: `https://file.${domain}/emoji/graphics/blush.png`,
      smiley: `https://file.${domain}/emoji/graphics/smiley.png`,
      relaxed: `https://file.${domain}/emoji/graphics/relaxed.png`,
      smirk: `https://file.${domain}/emoji/graphics/smirk.png`,
      heart_eyes: `https://file.${domain}/emoji/graphics/heart_eyes.png`,
      kissing_heart: `https://file.${domain}/emoji/graphics/kissing_heart.png`,
      kissing_closed_eyes: `https://file.${domain}/emoji/graphics/kissing_closed_eyes.png`,
      flushed: `https://file.${domain}/emoji/graphics/flushed.png`,
      relieved: `https://file.${domain}/emoji/graphics/relieved.png`,
      satisfied: `https://file.${domain}/emoji/graphics/satisfied.png`,
      grin: `https://file.${domain}/emoji/graphics/grin.png`,
      wink: `https://file.${domain}/emoji/graphics/wink.png`,
      stuck_out_tongue_winking_eye: `https://file.${domain}/emoji/graphics/stuck_out_tongue_winking_eye.png`,
      stuck_out_tongue_closed_eyes: `https://file.${domain}/emoji/graphics/stuck_out_tongue_closed_eyes.png`,
      grinning: `https://file.${domain}/emoji/graphics/grinning.png`,
      kissing: `https://file.${domain}/emoji/graphics/kissing.png`,
      kissing_smiling_eyes: `https://file.${domain}/emoji/graphics/kissing_smiling_eyes.png`,
      stuck_out_tongue: `https://file.${domain}/emoji/graphics/stuck_out_tongue.png`,
      sleeping: `https://file.${domain}/emoji/graphics/sleeping.png`,
      worried: `https://file.${domain}/emoji/graphics/worried.png`,
      frowning: `https://file.${domain}/emoji/graphics/frowning.png`,
      anguished: `https://file.${domain}/emoji/graphics/anguished.png`,
      open_mouth: `https://file.${domain}/emoji/graphics/open_mouth.png`,
      grimacing: `https://file.${domain}/emoji/graphics/grimacing.png`,
      confused: `https://file.${domain}/emoji/graphics/confused.png`,
      hushed: `https://file.${domain}/emoji/graphics/hushed.png`,
      expressionless: `https://file.${domain}/emoji/graphics/expressionless.png`,
      unamused: `https://file.${domain}/emoji/graphics/unamused.png`,
      sweat_smile: `https://file.${domain}/emoji/graphics/sweat_smile.png`,
      sweat: `https://file.${domain}/emoji/graphics/sweat.png`,
      disappointed_relieved: `https://file.${domain}/emoji/graphics/disappointed_relieved.png`,
      weary: `https://file.${domain}/emoji/graphics/weary.png`,
      pensive: `https://file.${domain}/emoji/graphics/pensive.png`,
      disappointed: `https://file.${domain}/emoji/graphics/disappointed.png`,
      confounded: `https://file.${domain}/emoji/graphics/confounded.png`,
      fearful: `https://file.${domain}/emoji/graphics/fearful.png`,
      cold_sweat: `https://file.${domain}/emoji/graphics/cold_sweat.png`,
      persevere: `https://file.${domain}/emoji/graphics/persevere.png`,
      cry: `https://file.${domain}/emoji/graphics/cry.png`,
      sob: `https://file.${domain}/emoji/graphics/sob.png`,
      joy: `https://file.${domain}/emoji/graphics/joy.png`,
      astonished: `https://file.${domain}/emoji/graphics/astonished.png`,
      scream: `https://file.${domain}/emoji/graphics/scream.png`,
      tired_face: `https://file.${domain}/emoji/graphics/tired_face.png`,
      angry: `https://file.${domain}/emoji/graphics/angry.png`,
      rage: `https://file.${domain}/emoji/graphics/rage.png`,
      triumph: `https://file.${domain}/emoji/graphics/triumph.png`,
      sleepy: `https://file.${domain}/emoji/graphics/sleepy.png`,
      yum: `https://file.${domain}/emoji/graphics/yum.png`,
      mask: `https://file.${domain}/emoji/graphics/mask.png`,
      sunglasses: `https://file.${domain}/emoji/graphics/sunglasses.png`,
      dizzy_face: `https://file.${domain}/emoji/graphics/dizzy_face.png`,
      imp: `https://file.${domain}/emoji/graphics/imp.png`,
      smiling_imp: `https://file.${domain}/emoji/graphics/smiling_imp.png`,
      neutral_face: `https://file.${domain}/emoji/graphics/neutral_face.png`,
      no_mouth: `https://file.${domain}/emoji/graphics/no_mouth.png`,
      innocent: `https://file.${domain}/emoji/graphics/innocent.png`,
      alien: `https://file.${domain}/emoji/graphics/alien.png`,
      yellow_heart: `https://file.${domain}/emoji/graphics/yellow_heart.png`,
      blue_heart: `https://file.${domain}/emoji/graphics/blue_heart.png`,
      purple_heart: `https://file.${domain}/emoji/graphics/purple_heart.png`,
      heart: `https://file.${domain}/emoji/graphics/heart.png`,
      green_heart: `https://file.${domain}/emoji/graphics/green_heart.png`,
      broken_heart: `https://file.${domain}/emoji/graphics/broken_heart.png`,
      heartbeat: `https://file.${domain}/emoji/graphics/heartbeat.png`,
      heartpulse: `https://file.${domain}/emoji/graphics/heartpulse.png`,
      two_hearts: `https://file.${domain}/emoji/graphics/two_hearts.png`,
      revolving_hearts: `https://file.${domain}/emoji/graphics/revolving_hearts.png`,
      cupid: `https://file.${domain}/emoji/graphics/cupid.png`,
      sparkling_heart: `https://file.${domain}/emoji/graphics/sparkling_heart.png`,
      sparkles: `https://file.${domain}/emoji/graphics/sparkles.png`,
      star: `https://file.${domain}/emoji/graphics/star.png`,
      star2: `https://file.${domain}/emoji/graphics/star2.png`,
      dizzy: `https://file.${domain}/emoji/graphics/dizzy.png`,
      boom: `https://file.${domain}/emoji/graphics/boom.png`,
      collision: `https://file.${domain}/emoji/graphics/collision.png`,
      anger: `https://file.${domain}/emoji/graphics/anger.png`,
      exclamation: `https://file.${domain}/emoji/graphics/exclamation.png`,
      question: `https://file.${domain}/emoji/graphics/question.png`,
      grey_exclamation: `https://file.${domain}/emoji/graphics/grey_exclamation.png`,
      grey_question: `https://file.${domain}/emoji/graphics/grey_question.png`,
      zzz: `https://file.${domain}/emoji/graphics/zzz.png`,
      dash: `https://file.${domain}/emoji/graphics/dash.png`,
      sweat_drops: `https://file.${domain}/emoji/graphics/sweat_drops.png`,
      notes: `https://file.${domain}/emoji/graphics/notes.png`,
      musical_note: `https://file.${domain}/emoji/graphics/musical_note.png`,
      fire: `https://file.${domain}/emoji/graphics/fire.png`,
      poop: `https://file.${domain}/emoji/graphics/poop.png`,
      '+1': `https://file.${domain}/emoji/graphics/%2B1.png`,
      thumbsup: `https://file.${domain}/emoji/graphics/thumbsup.png`,
      '-1': `https://file.${domain}/emoji/graphics/-1.png`,
      thumbsdown: `https://file.${domain}/emoji/graphics/thumbsdown.png`,
      ok_hand: `https://file.${domain}/emoji/graphics/ok_hand.png`,
      punch: `https://file.${domain}/emoji/graphics/punch.png`,
      facepunch: `https://file.${domain}/emoji/graphics/facepunch.png`,
      fist: `https://file.${domain}/emoji/graphics/fist.png`,
      v: `https://file.${domain}/emoji/graphics/v.png`,
      wave: `https://file.${domain}/emoji/graphics/wave.png`,
      hand: `https://file.${domain}/emoji/graphics/hand.png`,
      raised_hand: `https://file.${domain}/emoji/graphics/raised_hand.png`,
      open_hands: `https://file.${domain}/emoji/graphics/open_hands.png`,
      point_up: `https://file.${domain}/emoji/graphics/point_up.png`,
      point_down: `https://file.${domain}/emoji/graphics/point_down.png`,
      point_left: `https://file.${domain}/emoji/graphics/point_left.png`,
      point_right: `https://file.${domain}/emoji/graphics/point_right.png`,
      raised_hands: `https://file.${domain}/emoji/graphics/raised_hands.png`,
      pray: `https://file.${domain}/emoji/graphics/pray.png`,
      point_up_2: `https://file.${domain}/emoji/graphics/point_up_2.png`,
      clap: `https://file.${domain}/emoji/graphics/clap.png`,
      muscle: `https://file.${domain}/emoji/graphics/muscle.png`,
      couple: `https://file.${domain}/emoji/graphics/couple.png`,
      family: `https://file.${domain}/emoji/graphics/family.png`,
      two_men_holding_hands: `https://file.${domain}/emoji/graphics/two_men_holding_hands.png`,
      two_women_holding_hands: `https://file.${domain}/emoji/graphics/two_women_holding_hands.png`,
      dancer: `https://file.${domain}/emoji/graphics/dancer.png`,
      dancers: `https://file.${domain}/emoji/graphics/dancers.png`,
      ok_woman: `https://file.${domain}/emoji/graphics/ok_woman.png`,
      no_good: `https://file.${domain}/emoji/graphics/no_good.png`,
      information_desk_person: `https://file.${domain}/emoji/graphics/information_desk_person.png`,
      raising_hand: `https://file.${domain}/emoji/graphics/raising_hand.png`,
      bride_with_veil: `https://file.${domain}/emoji/graphics/bride_with_veil.png`,
      person_with_pouting_face: `https://file.${domain}/emoji/graphics/person_with_pouting_face.png`,
      person_frowning: `https://file.${domain}/emoji/graphics/person_frowning.png`,
      bow: `https://file.${domain}/emoji/graphics/bow.png`,
      couplekiss: `https://file.${domain}/emoji/graphics/couplekiss.png`,
      couple_with_heart: `https://file.${domain}/emoji/graphics/couple_with_heart.png`,
      massage: `https://file.${domain}/emoji/graphics/massage.png`,
      haircut: `https://file.${domain}/emoji/graphics/haircut.png`,
      nail_care: `https://file.${domain}/emoji/graphics/nail_care.png`,
      boy: `https://file.${domain}/emoji/graphics/boy.png`,
      girl: `https://file.${domain}/emoji/graphics/girl.png`,
      woman: `https://file.${domain}/emoji/graphics/woman.png`,
      man: `https://file.${domain}/emoji/graphics/man.png`,
      baby: `https://file.${domain}/emoji/graphics/baby.png`,
      older_woman: `https://file.${domain}/emoji/graphics/older_woman.png`,
      older_man: `https://file.${domain}/emoji/graphics/older_man.png`,
      person_with_blond_hair: `https://file.${domain}/emoji/graphics/person_with_blond_hair.png`,
      man_with_gua_pi_mao: `https://file.${domain}/emoji/graphics/man_with_gua_pi_mao.png`,
      man_with_turban: `https://file.${domain}/emoji/graphics/man_with_turban.png`,
      construction_worker: `https://file.${domain}/emoji/graphics/construction_worker.png`,
      cop: `https://file.${domain}/emoji/graphics/cop.png`,
      angel: `https://file.${domain}/emoji/graphics/angel.png`,
      princess: `https://file.${domain}/emoji/graphics/princess.png`,
      smiley_cat: `https://file.${domain}/emoji/graphics/smiley_cat.png`,
      smile_cat: `https://file.${domain}/emoji/graphics/smile_cat.png`,
      heart_eyes_cat: `https://file.${domain}/emoji/graphics/heart_eyes_cat.png`,
      kissing_cat: `https://file.${domain}/emoji/graphics/kissing_cat.png`,
      smirk_cat: `https://file.${domain}/emoji/graphics/smirk_cat.png`,
      scream_cat: `https://file.${domain}/emoji/graphics/scream_cat.png`,
      crying_cat_face: `https://file.${domain}/emoji/graphics/crying_cat_face.png`,
      joy_cat: `https://file.${domain}/emoji/graphics/joy_cat.png`,
      pouting_cat: `https://file.${domain}/emoji/graphics/pouting_cat.png`,
      japanese_ogre: `https://file.${domain}/emoji/graphics/japanese_ogre.png`,
      japanese_goblin: `https://file.${domain}/emoji/graphics/japanese_goblin.png`,
      see_no_evil: `https://file.${domain}/emoji/graphics/see_no_evil.png`,
      hear_no_evil: `https://file.${domain}/emoji/graphics/hear_no_evil.png`,
      speak_no_evil: `https://file.${domain}/emoji/graphics/speak_no_evil.png`,
      guardsman: `https://file.${domain}/emoji/graphics/guardsman.png`,
      skull: `https://file.${domain}/emoji/graphics/skull.png`,
      feet: `https://file.${domain}/emoji/graphics/feet.png`,
      lips: `https://file.${domain}/emoji/graphics/lips.png`,
      kiss: `https://file.${domain}/emoji/graphics/kiss.png`,
      droplet: `https://file.${domain}/emoji/graphics/droplet.png`,
      ear: `https://file.${domain}/emoji/graphics/ear.png`,
      eyes: `https://file.${domain}/emoji/graphics/eyes.png`,
      nose: `https://file.${domain}/emoji/graphics/nose.png`,
      tongue: `https://file.${domain}/emoji/graphics/tongue.png`,
      love_letter: `https://file.${domain}/emoji/graphics/love_letter.png`,
      bust_in_silhouette: `https://file.${domain}/emoji/graphics/bust_in_silhouette.png`,
      busts_in_silhouette: `https://file.${domain}/emoji/graphics/busts_in_silhouette.png`,
      speech_balloon: `https://file.${domain}/emoji/graphics/speech_balloon.png`,
      thought_balloon: `https://file.${domain}/emoji/graphics/thought_balloon.png`,
    };
  }

  async get(): Promise<string[]> {
    let rsp;
    try {
      rsp = await request({
        url: `api/cloud/get`,
        method: 'post',
        data: {
          gameId: 'emojis',
          apiKey: this._apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      this._emojis = JSON.parse(rsp.data);
      return this._emojis.concat([]);
    } catch (e) {
      throw e;
    }
  }

  /**
   * 设置表情包列表
   * @param data 所有表情包图像列表
   */
  async set(data: string[]) {
    let rsp;
    try {
      rsp = await request({
        url: `api/cloud/sync`,
        method: 'post',
        data: {
          gameId: 'emojis',
          data: JSON.stringify(data),
          apiKey: this._apiKey,
        },
      });

      if (rsp.code) throw new Error(rsp.msg);

      return rsp;
    } catch (e) {
      throw e;
    }
  }

  async append(url: string): Promise<string[]> {
    let emojis = this._emojis.length > 0 ? this._emojis : await this.get();
    if (emojis.indexOf(url) >= 0) throw new Error('表情包已存在');
    emojis.push(url);
    await this.set(emojis);
    this._emojis = emojis;
    return emojis.concat([]);
  }

  async remove(url: string): Promise<string[]> {
    let emojis = this._emojis.length > 0 ? this._emojis : await this.get();
    if (emojis.indexOf(url) < 0) return emojis;
    emojis.splice(emojis.indexOf(url), 1);
    await this.set(emojis);
    this._emojis = emojis;
    return emojis.concat([]);
  }

  async exists(url: string): Promise<Boolean> {
    let emojis = this._emojis.length > 0 ? this._emojis : await this.get();
    return emojis.indexOf(url) >= 0;
  }
}
