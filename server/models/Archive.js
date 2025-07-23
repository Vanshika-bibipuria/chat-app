const mongoose = require('mongoose');

const ArchiveSchema = new mongoose.Schema({
  chatId: String,
  userId: String,
  archivedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Archive', ArchiveSchema);
