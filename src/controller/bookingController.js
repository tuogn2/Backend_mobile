const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

class bookingController {

  // Thêm một đặt phòng mới
  async createBooking(req, res) {
    try {
      const { userId, roomId, checkInDate, checkOutDate } = req.body;

      // Kiểm tra xem người dùng và phòng có tồn tại không
      const userExists = await User.findById(userId);
      const roomExists = await Room.findById(roomId);

      if (!userExists || !roomExists) {
        return res.status(404).json({ message: "Người dùng hoặc phòng không tồn tại." });
      }

      // Kiểm tra xem phòng đã được đặt trong khoảng thời gian này chưa
      const roomBooked = await Booking.findOne({
        roomId,
        $or: [
          { checkInDate: { $gte: checkInDate, $lt: checkOutDate } },
          { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },
        ],
      });

      if (roomBooked) {
        return res.status(400).json({ message: "Phòng này đã được đặt trong khoảng thời gian này." });
      }

      // Tạo mới một đơn đặt phòng
      const newBooking = new Booking({
        userId,
        roomId,
        checkInDate,
        checkOutDate,
      });

      // Lưu vào cơ sở dữ liệu
      await newBooking.save();
      res.status(201).json({ message: "Đặt phòng thành công!", booking: newBooking });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Lấy danh sách tất cả đặt phòng của người dùng
  async getUserBookings(req, res) {
    try {
      const { userId } = req.params;

      // Lấy tất cả đơn đặt phòng của người dùng
      const bookings = await Booking.find({ userId }).populate("roomId");

      if (bookings.length === 0) {
        return res.status(404).json({ message: "Không có đơn đặt phòng nào." });
      }

      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Cập nhật trạng thái đặt phòng
  async updateBookingStatus(req, res) {
    try {
      const { bookingId, status } = req.body;

      // Kiểm tra trạng thái hợp lệ
      const validStatuses = ["pending", "confirmed", "canceled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ." });
      }

      // Cập nhật trạng thái đặt phòng
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng." });
      }

      res.status(200).json({ message: "Trạng thái đặt phòng đã được cập nhật.", booking: updatedBooking });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = new bookingController();
