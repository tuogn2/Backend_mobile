const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa mô hình User
const userSchema = new Schema({
  name: { type: String, required: true },  // Tên người dùng
  email: { type: String  },  // Email duy nhất
  password: { type: String, required: true },  // Mật khẩu người dùng
  phone: { type: String ,unique: true},  // Số điện thoại người dùng
  avatar: { type: String },  // Đường dẫn tới ảnh đại diện
  birthday: { type: Date },  // Ngày sinh
  createdAt: { type: Date, default: Date.now },  // Thời gian tạo
  updatedAt: { type: Date, default: Date.now },  // Thời gian cập nhật
});

// Mô hình User
const User = mongoose.model('User', userSchema);

module.exports = User;

