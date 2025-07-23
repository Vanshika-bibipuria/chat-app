const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages (excluding archived)
router.get('/', async (req, res) => {
  const messages = await Message.find({ archived: false }).sort('timestamp');
  res.json(messages);
});

// Create a message
router.post('/', async (req, res) => {
  const { sender, text } = req.body;
  const message = await Message.create({ sender, text });
  res.json(message);
});

// Delete a message
router.delete('/:id', async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Restore (Undo) a deleted message
router.post('/restore', async (req, res) => {
  const { sender, text, timestamp } = req.body;
  const restored = await Message.create({ sender, text, timestamp });
  res.json(restored);
});

// Archive message
router.post('/archive/:id', async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { archived: true });
  res.json({ message: 'Archived' });
});

module.exports = router;
