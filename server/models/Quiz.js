const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number
});


const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [Number],
  result: String,
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Quiz', quizSchema);

module.exports = mongoose.model('QuizResult', quizResultSchema);