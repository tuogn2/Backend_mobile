// routes/chat.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');



router.get('/rooms', async (req, res) => {
  try {
    // Truy vấn tất cả các userId (phòng) đã trò chuyện với admin
    const rooms = await Message.distinct('room'); // 'room' là trường chứa userId
    res.status(200).json(rooms);  // Trả về danh sách các userId (phòng)
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Error fetching rooms' });
  }
});
// API lấy lịch sử tin nhắn
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Truy vấn tin nhắn từ cơ sở dữ liệu dựa trên userId
    const messages = await Message.find({ room: userId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ error: 'Error fetching message history' });
  }
});

module.exports = router;
