const auth = require('./auth');
const service = require('./service/question');
const Question = require('./model/question');

class Ranker {
    async answer(req, newResponse) {
        const body = JSON.parse(newResponse.body);
        const options = body.data.options;
        const [question] = await Question.findOrCreate({
            where: { question: body.data.quiz },
            defaults: {
                question: body.data.quiz,
                a: options[0],
                b: options[1],
                c: options[2],
                d: options[3],
                answer: -1,
            },
        });
        if (question.answer === -1) {
            console.log(question.question, '未匹配');
            this.question = question;
            return { response: newResponse };
        }
        const dbOptions = [question.a, question.b, question.c, question.d];
        const option = dbOptions[question.answer - 1];
        const index = options.indexOf(option);
        body.data.options[index] = `###${option}###`;
        console.log(question.question, option, '=>', index + 1);
        newResponse.body = JSON.stringify(body);
        return { response: newResponse };
    }

    async save(req, newResponse) {
        const body = JSON.parse(newResponse.body);
        try {
            const answer = body.data.answer;
            if (this.question) {
                this.question.answer = answer;
                await this.question.save();
                const dbOptions = [this.question.a, this.question.b, this.question.c, this.question.d];
                console.log(this.question.question, dbOptions[answer - 1], '已保存');
                this.question = null;
            }
        } catch (e) {
            console.error(e);
        }

        newResponse.body = JSON.stringify(body);
        return { response: newResponse };
    }
}


const ranker = new Ranker();

module.exports = {
    summary: '头脑王者辅助',
    async beforeSendRequest(req) {
        if (req.url.indexOf('https://question.hortor.net/question/bat/match') !== -1) {
            console.log('开始匹配');
        }
        return req;
    },
    async beforeDealHttpsRequest(req) {
        if (req.host && req.host.includes('question.hortor.net')) {
            return true;
        }
        return false;
    },
    async beforeSendResponse(req, res) {
        if (req.url.indexOf('https://question.hortor.net/question/bat/findQuiz') !== -1) {
            const newResponse = Object.assign({}, res.response)
            return ranker.answer(req, newResponse);
        } else if (req.url.indexOf('https://question.hortor.net/question/bat/choose') !== -1) {
            const newResponse = Object.assign({}, res.response)
            return ranker.save(req, newResponse);
        }
        return res;
    },
};
