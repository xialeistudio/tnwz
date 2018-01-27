const axios = require('axios');
const qs = require('querystring');
const crypto = require('crypto');

exports.getUserAgent = function() {
  const list = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0_3 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A432 MicroMessenger/6.6.1 NetType/WIFI Language/zh_CN',
    'WeChat/6.6.1.32 CFNetwork/887 Darwin/17.0.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1',
  ];
  return list[Math.floor(Math.random() * list.length)];
};
exports.makeSign = function makeSign(params, token) {
  if (token) {
    params.token = token;
  }
  const md5 = crypto.createHash('md5');
  md5.update(qs.stringify(params).split('&').sort().join(''));
  return md5.digest('hex');
};

/**
 * 加入房间
 * @param roomId
 * @param uid
 * @param token
 */
exports.join = async function join(roomId, uid, token) {
  const params = {
    roomID: roomId,
    uid,
    t: Date.now(),
  };
  params.sign = exports.makeSign(params, token);
  const req = await axios.post('https://question.hortor.net/question/bat/intoRoom', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': exports.getUserAgent(),
    },
  });
  const data = req.data;
  if (data.errcode > 0) {
    throw new Error(data.errmsg);
  }
  return data;
};

/**
 * 离开房间
 * @param roomId
 * @param uid
 * @param token
 */
exports.leave = async function leave(roomId, uid, token) {
  const params = {
    roomID: roomId,
    uid,
    t: Date.now(),
  };
  params.sign = exports.makeSign(params, token);
  const req = await axios.post('https://question.hortor.net/question/bat/leaveRoom', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': exports.getUserAgent(),
    },
  });
  const data = req.data;
  if (data.errcode > 0) {
    throw new Error(data.errmsg);
  }
  return data;
};
/**
 * 开始对战
 * @param roomId
 * @param uid
 * @param token
 */
exports.beginFight = async function beginFight(roomId, uid, token) {
  const params = {
    roomID: roomId,
    uid,
    t: Date.now(),
  };
  params.sign = exports.makeSign(params, token);
  const req = await axios.post('https://question.hortor.net/question/bat/beginFight', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': exports.getUserAgent(),
    },
  });
  const data = req.data;
  if (data.errcode > 0) {
    throw new Error(data.errmsg);
  }
  return data;
};
/**
 * 获取问题
 * @param roomId
 * @param uid
 * @param token
 * @param quizNum
 */
exports.fetchQuestion = async function findQuestion(roomId, uid, token, quizNum) {
  const params = {
    roomID: roomId,
    uid,
    t: Date.now(),
    quizNum,
  };
  params.sign = exports.makeSign(params, token);
  const req = await axios.post('https://question.hortor.net/question/bat/findQuiz', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': exports.getUserAgent(),
    },
  });
  const data = req.data;
  if (data.errcode > 0) {
    throw new Error(data.errmsg);
  }
  return data;
};
/**
 * 选择答案
 * @param roomId
 * @param uid
 * @param token
 * @param quizNum
 * @param options
 */
exports.chooseAnswer = async function chooseAnswer(roomId, uid, token, quizNum, options) {
  const params = {
    roomID: roomId,
    uid,
    t: Date.now(),
    quizNum,
    options,
  };
  params.sign = exports.makeSign(params, token);
  const req = await axios.post('https://question.hortor.net/question/bat/choose', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': exports.getUserAgent(),
    },
  });
  const data = req.data;
  if (data.errcode > 0) {
    throw new Error(data.errmsg);
  }
  return data;
};

/**
 * 获取对战结果
 * @param roomId
 * @param uid
 * @param token
 */
exports.getResult = async function getResult(roomId, uid, token) {
  const params = {
    roomID: roomId,
    uid,
    t: Date.now(),
  };
  params.sign = exports.makeSign(params, token);
  const req = await axios.post('https://question.hortor.net/question/bat/fightResult', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': exports.getUserAgent(),
    },
  });
  const data = req.data;
  if (data.errcode > 0) {
    throw new Error(data.errmsg);
  }
  return data;
};
/**
 * 延迟
 * @param timeout
 * @returns {Promise<any>}
 */
exports.delay = function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
