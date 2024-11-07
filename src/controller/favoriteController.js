const Favorite = require("../models/Favorite");
const Room = require("../models/Room");
const User = require("../models/User");

class favoriteController {

  // Thêm phòng vào danh sách yêu thích
  async addFavorite(req, res) {
    try {
      const { userId, roomId } = req.body;

      // Kiểm tra xem người dùng và phòng có tồn tại không
      const userExists = await User.findById(userId);
      const roomExists = await Room.findById(roomId);

      if (!userExists || !roomExists) {
        return res.status(404).json({ message: "Người dùng hoặc phòng không tồn tại." });
      }

      // Kiểm tra xem phòng đã có trong danh sách yêu thích của người dùng chưa
      const existingFavorite = await Favorite.findOne({ userId, roomId });

      if (existingFavorite) {
        return res.status(400).json({ message: "Phòng này đã được thêm vào danh sách yêu thích của bạn." });
      }

      // Tạo mới một mục yêu thích
      const newFavorite = new Favorite({
        userId,
        roomId
      });

      // Lưu vào cơ sở dữ liệu
      await newFavorite.save();
      res.status(201).json({ message: "Đã thêm phòng vào danh sách yêu thích!" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Lấy tất cả phòng yêu thích của người dùng
  async getFavorites(req, res) {
    try {
      const { userId } = req.params;

      // Tìm kiếm tất cả các phòng yêu thích của người dùng
      const favorites = await Favorite.find({ userId }).populate("roomId");

      if (favorites.length === 0) {
        return res.status(404).json({ message: "Không có phòng yêu thích nào." });
      }

      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Xóa phòng khỏi danh sách yêu thích
  async removeFavorite(req, res) {
    try {
      const { userId, roomId } = req.params;

      // Tìm và xóa phòng khỏi danh sách yêu thích của người dùng
      const favorite = await Favorite.findOneAndDelete({ userId, roomId });

      if (!favorite) {
        return res.status(404).json({ message: "Phòng này không có trong danh sách yêu thích của bạn." });
      }

      res.status(200).json({ message: "Đã xóa phòng khỏi danh sách yêu thích." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = new favoriteController();
