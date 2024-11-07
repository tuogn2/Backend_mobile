const express = require("express");
const route = express.Router();
const reviewController = require("../controller/reviewController");

// Thêm đánh giá mới
route.post("/", reviewController.addReview);

// Lấy tất cả đánh giá cho một phòng
route.get("/room/:roomId", reviewController.getAllReviewsForRoom);

// Lấy đánh giá của một người dùng cho một phòng cụ thể
route.get("/user/:userId/room/:roomId", reviewController.getUserReviewForRoom);

module.exports = route;
