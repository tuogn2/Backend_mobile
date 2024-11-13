const Message = require('../models/Message'); // Import mô hình Message

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);

    socket.on('joinUserRoom', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('sendMessageToUser', async (message) => {
      const { userId, messageContent } = message;
      console.log(`Sending message from admin to user ${userId}: ${messageContent}`);

      // Phát tin nhắn tới phòng của user (chỉ gửi cho user)
      io.to(userId).emit('newMessage', {
        sender: 'admin',
        content: messageContent,
      });

      // Lưu tin nhắn vào cơ sở dữ liệu
      const newMessage = new Message({
        room: userId,
        sender: 'admin',
        content: messageContent,
      });
      await newMessage.save();
    });

    socket.on('sendMessageToAdmin', async (message) => {
      const { userId, messageContent ,nameuser} = message;
      console.log(`User ${userId} sent a message to admin: ${messageContent}`);

      // Chỉ gửi tin nhắn đến admin
      io.to('adminRoom').emit('newMessage', {
        userId: userId,
        sender: nameuser,
        message: messageContent,
      });

      // Lưu tin nhắn vào cơ sở dữ liệu
      const newMessage = new Message({
        room: userId,
        sender: nameuser,
        content: messageContent,
      });
      await newMessage.save();
    });

    socket.on('joinAdminRoom', () => {
      socket.join('adminRoom');
      console.log('Admin joined admin room');
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
