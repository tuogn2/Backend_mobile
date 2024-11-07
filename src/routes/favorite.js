const express = require("express");
const route = express.Router();
const favoriteController = require("../controller/favoriteController");

// Thêm phòng vào danh sách yêu thích
route.post("/", favoriteController.addFavorite);

// Lấy tất cả phòng yêu thích của người dùng
route.get("/:userId", favoriteController.getFavorites);

// Xóa phòng khỏi danh sách yêu thích
route.delete("/:userId/:roomId", favoriteController.removeFavorite);

module.exports = route;
