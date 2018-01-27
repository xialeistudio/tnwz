const Sequelize = require('sequelize');
const sequelize = require('../ctx/sequelize');

const Question = sequelize.define('Question', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  question: Sequelize.STRING(100),
  a: Sequelize.STRING(20),
  b: Sequelize.STRING(20),
  c: Sequelize.STRING(20),
  d: Sequelize.STRING(20),
  answer: Sequelize.INTEGER,
}, {
  tableName: 'question',
  timestamp: false,
  indexes: [
    { name: 'idx_question', unique: true, fields: ['question'] },
  ],
});

module.exports = Question;