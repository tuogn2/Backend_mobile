const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa mô hình Favorite
const favoriteSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Liên kết đến mô hình User
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Liên kết đến mô hình Room
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo favorite
}, { timestamps: true });  // Tự động thêm createdAt và updatedAt

// Mô hình Favorite
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
