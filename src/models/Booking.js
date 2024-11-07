const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa mô hình Booking
const bookingSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Liên kết đến mô hình User
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },  // Liên kết đến mô hình Room
  bookingDate: { type: Date, default: Date.now },                                // Ngày đặt phòng
  checkInDate: { type: Date, required: true },                                   // Ngày check-in
  checkOutDate: { type: Date, required: true },                                  // Ngày check-out
  status: { type: String, default: 'pending' },                                  // Trạng thái đặt phòng (ví dụ: pending, confirmed, canceled)
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

// Mô hình Booking
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
