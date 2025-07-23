const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  archived: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Message', MessageSchema);
