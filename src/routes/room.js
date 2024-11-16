const express = require("express");
const route = express.Router();
const roomController = require("../controller/RoomController");

// Thêm phòng mới
route.post("/", roomController.addRoom);
route.get("/search", roomController.searchRooms);
// Lấy tất cả phòng
route.get("/:roomId", roomController.getRoomById);
// Lấy phòng theo thể loại
route.get("/type/:typeRoom/:userid", roomController.getRoomsByType);
route.get("/", roomController.getAllRooms);

route.post("/get-rooms-by-ids", roomController.getRoomsByIds);

route.get(
  "/search/area-price-range",
  roomController.searchRoomsByAreaAndPriceRange
);

module.exports = route;
