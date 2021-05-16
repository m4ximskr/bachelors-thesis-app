const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  created_at: {
    type: Number,
    required: true,
  },
  question_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
});

const Answer = mongoose.model('Answer', AnswerSchema);
module.exports = {Answer};
