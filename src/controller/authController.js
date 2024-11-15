const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { faker } = require('@faker-js/faker');
class UserController {
  
  // Đăng ký người dùng mới bằng số điện thoại và mật khẩu
  async signup(req, res) {
    const { phone, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!phone || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
      // Kiểm tra xem số điện thoại đã tồn tại chưa
      const existingUserByPhone = await User.findOne({ phone });
      if (existingUserByPhone) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
      }

      // Tạo tên ngẫu nhiên
      const name = faker.person.fullName();  // Tạo tên ngẫu nhiên

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới với tên ngẫu nhiên
      const newUser = new User({
        name,
        phone,
        password: hashedPassword,
        createdAt: new Date(),
      });

      await newUser.save();

      // Tạo mã token xác thực
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ message: "Đăng ký thành công", user: newUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi máy chủ" });
    }
  }
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Tìm người dùng qua email
      const user = await User.findOne({ email })
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
  // Đăng nhập người dùng bằng số điện thoại
  async loginWithPhone(req, res) {
    const { phone, password } = req.body;

    try {
      // Tìm người dùng qua số điện thoại
      const user = await User.findOne({ phone })
      if (!user) {
        return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không đúng" });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không đúng" });
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
