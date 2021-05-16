const mongoose = require('mongoose');

const StarSchema = new mongoose.Schema({
  answer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

const Star = mongoose.model('Star', StarSchema);
module.exports = {Star};
