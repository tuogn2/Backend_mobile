const User = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

class userController {
    // Lấy thông tin người dùng theo ID
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
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
                    folder: "avatars"
                });
                user.avatar = result.secure_url;
            }

            // Cập nhật các trường khác
            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            user.birthday = birthday || user.birthday;

            await user.save();
            res.status(200).json({ message: "User information updated successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Error updating user information", error });
        }
    }
}

module.exports = new userController();
