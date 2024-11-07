const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailService");

class UserController {
  
  // Đăng ký người dùng mới bằng email
  async signup(req, res) {
    const { name, email, password, phone } = req.body;

    try {
      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        createdAt: new Date(),
      });

      await newUser.save();

      // Tạo mã token xác thực
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Gửi email xác nhận
      const emailContent = `Xin chào ${name}, cảm ơn bạn đã đăng ký.`;
      await sendEmail(email, "Đăng ký thành công", emailContent);

      res.status(201).json({ message: "Đăng ký thành công", user: newUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi máy chủ" });
    }
  }

  // Đăng nhập người dùng bằng email
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Tìm người dùng qua email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
      }

      // Tạo mã token đăng nhập
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: "Đăng nhập thành công", user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi máy chủ" });
    }
  }
}

module.exports = new UserController();
