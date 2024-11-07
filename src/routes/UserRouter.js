const express = require("express");
const route = express.Router();
const userController = require("../controller/userController");
const upload = require("../middleware/upload");

// Lấy thông tin người dùng theo ID
route.get("/:id", userController.getUserById);

// Thay đổi mật khẩu
route.put("/change-password/:id", userController.changePassword);

// Cập nhật thông tin người dùng (bao gồm cập nhật ảnh đại diện)
route.put("/change-infor/:id", upload.single("avt"), userController.updateUser);

module.exports = route;
