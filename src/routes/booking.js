const express = require("express");
const route = express.Router();
const bookingController = require("../controller/bookingController");

// Thêm một đơn đặt phòng mới
route.post("/", bookingController.createBooking);

// Lấy tất cả đơn đặt phòng của người dùng
route.get("/:userId", bookingController.getUserBookings);

// Cập nhật trạng thái đặt phòng
route.put("/status", bookingController.updateBookingStatus);

module.exports = route;
