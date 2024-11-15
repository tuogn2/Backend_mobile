const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa mô hình Payment
const paymentSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Liên kết đến mô hình User

  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  }, // Liên kết đến mô hình Room

  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  }, // Liên kết đến mô hình Booking

  paymentMethod: { 
    type: String, 
    required: true 
  }, // Phương thức thanh toán

  amount: { 
    type: Number, 
    required: true, 
    min: [1000, 'Số tiền thanh toán tối thiểu là 1000 đồng']  // Thiết lập số tiền tối thiểu thanh toán
  }, // Số tiền đã thanh toán

  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed'],  // Giới hạn trạng thái thanh toán
    default: 'pending' // Trạng thái mặc định là 'pending'
  }, // Trạng thái thanh toán

  transactionId: { 
    type: String, 
    unique: true, 
    required: false  // Nếu cần theo dõi ID giao dịch từ hệ thống thanh toán
  },

  paymentDetails: { 
    type: Schema.Types.Mixed, 
    required: false 
  }, // Chi tiết giao dịch (ví dụ: mã giao dịch, phản hồi từ VNPay hoặc hệ thống thanh toán khác)

}, { timestamps: true });  // Tự động thêm createdAt và updatedAt

// Mô hình Payment
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
