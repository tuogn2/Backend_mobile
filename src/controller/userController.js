const User = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

class userController {
  // Lấy thông tin người dùng theo ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).populate("favorites");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user", error });
    }
  }

  // Thay đổi mật khẩu
  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating password", error });
    }
  }

  // Cập nhật thông tin người dùng
  async updateUser(req, res) {
    try {
      const { name, email, phone, birthday } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Upload avatar nếu có tệp được tải lên
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
        });
        user.avatar = result.secure_url;
      }

      // Cập nhật các trường khác
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.birthday = birthday || user.birthday;

      await user.save();
      res
        .status(200)
        .json({ message: "User information updated successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user information", error });
    }
  }

  // Add room to user's favorites (like)
  async likeRoom(req, res) {
    try {
      const { userid, roomId } = req.params;

      // Find the user and add the room to favorites if not already liked
      const user = await User.findById(userid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the room is already in favorites
      if (!user.favorites.includes(roomId)) {
        user.favorites.push(roomId);
        await user.save();
        return res
          .status(200)
          .json({
            message: "Room liked successfully",
            favorites: user.favorites,
          });
      } else {
        return res.status(400).json({ message: "Room is already liked" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Remove room from user's favorites (unlike)
  async unlikeRoom(req, res) {
    try {
      const { userid, roomId } = req.params;

      // Find the user and remove the room from favorites if it exists
      const user = await User.findById(userid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the room is in favorites
      if (user.favorites.includes(roomId)) {
        user.favorites = user.favorites.filter(
          (favRoomId) => favRoomId.toString() !== roomId
        );
        await user.save();
        return res
          .status(200)
          .json({
            message: "Room unliked successfully",
            favorites: user.favorites,
          });
      } else {
        return res.status(400).json({ message: "Room is not in favorites" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new userController();
