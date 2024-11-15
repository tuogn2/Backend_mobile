const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa mô hình Services (tiện ích, dịch vụ, nhà vệ sinh)
const servicesSchema = new Schema({
  facilities: { type: [String], required: true },  // Các tiện ích (ví dụ: điều hòa, WiFi, ...)
  service: { type: [String], required: true },      // Các dịch vụ kèm theo (ví dụ: dọn phòng, giặt ủi,...)
  bathroom: { type: [String], required: true },     // Thông tin về nhà vệ sinh (ví dụ: có bồn tắm, có nước nóng,...)
});

// Định nghĩa mô hình Room (phòng)
const roomSchema = new Schema({
  name: { type: String, required: true },           // Tên phòng
  description: { type: String, required: true },    // Mô tả về phòng
  price: { type: Number, required: true },          // Giá phòng
  location: { type: String, required: true },       // Địa chỉ/phòng
  listImage: { type: [String], required: true },    // Danh sách hình ảnh
  services: { type: servicesSchema, required: true }, // Dịch vụ và tiện ích (gắn với dịch vụ trên)
  typeRoom: { type: String, required: true },       // Loại phòng (Deluxe, Suite, ...)
  typeArea: { type: String, required: true },       // Loại khu vực (thành phố, biển, núi,...)
  quantity: { type: Number, required: true },       // Số lượng phòng
  
});

// Mô hình Room
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
