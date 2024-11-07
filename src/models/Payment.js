const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa mô hình Payment
const paymentSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },     // Liên kết đến mô hình User
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },     // Liên kết đến mô hình Room
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Liên kết đến mô hình Booking
  paymentMethod: { type: String, required: true },  // Phương thức thanh toán
  amount: { type: Number, required: true },         // Số tiền đã thanh toán
  status: { type: String, required: true },         // Trạng thái thanh toán
}, { timestamps: true });  // Tự động thêm createdAt và updatedAt

// Mô hình Payment
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
