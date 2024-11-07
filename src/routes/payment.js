const express = require("express");
const route = express.Router();
const paymentController = require("../controller/paymentController");

// Tạo mới một thanh toán
route.post("/", paymentController.createPayment);

// Lấy tất cả thanh toán của người dùng
route.get("/:userId", paymentController.getUserPayments);

// Cập nhật trạng thái thanh toán
route.put("/status", paymentController.updatePaymentStatus);

module.exports = route;
