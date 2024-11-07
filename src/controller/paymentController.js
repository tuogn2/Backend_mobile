const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

class paymentController {

  // Tạo mới một thanh toán
  async createPayment(req, res) {
    try {
      const { userId, roomId, bookingId, paymentMethod, amount, status } = req.body;

      // Kiểm tra sự tồn tại của người dùng, phòng và đơn đặt phòng
      const userExists = await User.findById(userId);
      const roomExists = await Room.findById(roomId);
      const bookingExists = await Booking.findById(bookingId);

      if (!userExists || !roomExists || !bookingExists) {
        return res.status(404).json({ message: "Người dùng, phòng hoặc đơn đặt phòng không tồn tại." });
      }

      // Tạo một thanh toán mới
      const newPayment = new Payment({
        userId,
        roomId,
        bookingId,
        paymentMethod,
        amount,
        status,
      });

      // Lưu vào cơ sở dữ liệu
      await newPayment.save();
      res.status(201).json({ message: "Thanh toán thành công!", payment: newPayment });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Lấy tất cả thanh toán của người dùng
  async getUserPayments(req, res) {
    try {
      const { userId } = req.params;

      // Lấy tất cả thanh toán của người dùng
      const payments = await Payment.find({ userId }).populate("roomId bookingId");

      if (payments.length === 0) {
        return res.status(404).json({ message: "Không có thanh toán nào." });
      }

      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(req, res) {
    try {
      const { paymentId, status } = req.body;

      // Kiểm tra trạng thái hợp lệ
      const validStatuses = ["pending", "completed", "failed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ." });
      }

      // Cập nhật trạng thái thanh toán
      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        { status },
        { new: true }
      );

      if (!updatedPayment) {
        return res.status(404).json({ message: "Không tìm thấy thanh toán." });
      }

      res.status(200).json({ message: "Trạng thái thanh toán đã được cập nhật.", payment: updatedPayment });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = new paymentController();
