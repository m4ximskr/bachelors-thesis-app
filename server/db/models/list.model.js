const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  created_at: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
});

const List = mongoose.model('List', ListSchema);
module.exports = {List};
