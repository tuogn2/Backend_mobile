const express = require("express");
const route = express.Router();
const roomController = require("../controller/RoomController");

// Thêm phòng mới
route.post("/", roomController.addRoom);

// Lấy tất cả phòng
route.get("/", roomController.getAllRooms);

// Lấy phòng theo thể loại
route.get("/type/:typeRoom", roomController.getRoomsByType);

module.exports = route;
