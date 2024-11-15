const express = require("express");
const route = express.Router();
const paymentController = require("../controller/paymentController");

// Tạo mới một thanh toán (Payment creation)
route.post("/", paymentController.createPayment);

// Xử lý phản hồi từ VNPay (Handle VNPay callback)
route.get("/return", paymentController.handleVNPayResponse);



module.exports = route;
