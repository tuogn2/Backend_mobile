const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa mô hình Review
const reviewSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Liên kết đến mô hình User
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },  // Liên kết đến mô hình Room
  rating: { type: Number, required: true, min: 1, max: 5 },  // Đánh giá của người dùng (từ 1 đến 5)
  comment: { type: String, required: true },  // Bình luận của người dùng
  createdAt: { type: Date, default: Date.now },  // Thời gian tạo review, mặc định là thời gian hiện tại
});

// Mô hình Review
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
