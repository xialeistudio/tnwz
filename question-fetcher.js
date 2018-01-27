const auth = require('./auth');
const service = require('./service/question');
const Question = require('./model/question');

class Fetcher {
  constructor() {
    setImmediate(async () => {
      await Question.sync();
      console.log('数据库连接成功');
      do {
        try {
          this.roomId = -1;
          await this.join();
          await this.beginFight();
          await this.doFight();
          await this.getResult();
          await this.leave();
        } catch (e) {
          console.error(e.message, e.code);
          if (e.message.indexOf('上局比赛异常结束，请尽量不要在答题过程中强行退') !== -1) {
            process.exit(1);
          }
        }
        await service.delay(Math.floor(Math.random() * 2000));
      } while (true);
    });
  }

  async join() {
    let ret = await service.join(this.roomId || -1, auth.player1.uid, auth.player1.token);
    this.roomId = ret.data.roomId;
    console.log('创建房间', this.roomId);
    await service.join(this.roomId, auth.player2.uid, auth.player2.token);
  }

  async beginFight() {
    await service.beginFight(this.roomId, auth.player1.uid, auth.player1.token);
  }

  async doFight() {
    for (let i = 0; i < 5; i++) {
      await this.doFightWithQuestion(i + 1);
      await service.delay(Math.floor(Math.random() * 200));
    }
  }

  async doFightWithQuestion(i) {
    let ret = await service.fetchQuestion(this.roomId, auth.player1.uid, auth.player1.token, i);
    const question = ret.data.quiz;
    const options = ret.data.options;

    ret = await service.chooseAnswer(this.roomId, auth.player1.uid, auth.player1.token, i, 1);
    const answer = ret.data.answer;
    const [aaa, isNew] = await this.saveQuestion(question, options, answer);
    console.log(i, question, options, answer, isNew ? 'newnewnew' : null);
    await service.chooseAnswer(this.roomId, auth.player2.uid, auth.player2.token, i, 1);
  }

  async getResult() {
    await service.getResult(this.roomId, auth.player1.uid, auth.player1.token);
    await service.getResult(this.roomId, auth.player2.uid, auth.player2.token);
  }

  async leave() {
    await service.leave(this.roomId, auth.player1.uid, auth.player1.token);
    await service.leave(this.roomId, auth.player2.uid, auth.player2.token);
    console.log('退出房间', this.roomId);
  }

  async saveQuestion(question, options, answer) {
    const attr = {
      question,
      a: options[0],
      b: options[1],
      c: options[2],
      d: options[3],
      answer,
    };
    return Question.findOrCreate({
      where: { question },
      defaults: attr,
    });
  }
}

new Fetcher();