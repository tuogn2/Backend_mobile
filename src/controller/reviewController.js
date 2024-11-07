const Review = require("../models/Review"); // Import mô hình Review
const Room = require("../models/Room");     // Import mô hình Room
const User = require("../models/User");     // Import mô hình User

class reviewController {
    
    // Thêm một đánh giá mới
    async addReview(req, res) {
        try {
            const { userId, roomId, rating, comment } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!userId || !roomId || !rating || !comment) {
                return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
            }

            // Kiểm tra xem userId và roomId có hợp lệ không
            const userExists = await User.findById(userId);
            const roomExists = await Room.findById(roomId);

            if (!userExists || !roomExists) {
                return res.status(404).json({ message: "Người dùng hoặc phòng không tồn tại." });
            }

            // Tạo đánh giá mới
            const newReview = new Review({
                userId,
                roomId,
                rating,
                comment
            });

            // Lưu đánh giá vào database
            await newReview.save();
            res.status(201).json({ message: "Thêm đánh giá thành công!", review: newReview });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    // Lấy tất cả đánh giá của một phòng
    async getAllReviewsForRoom(req, res) {
        try {
            const { roomId } = req.params;

            // Kiểm tra xem roomId có hợp lệ không
            const reviews = await Review.find({ roomId }).populate("userId", "name"); // Lấy tên người dùng

            if (!reviews.length) {
                return res.status(404).json({ message: "Không có đánh giá nào cho phòng này." });
            }

            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    // Lấy đánh giá của một người dùng cho một phòng cụ thể
    async getUserReviewForRoom(req, res) {
        try {
            const { userId, roomId } = req.params;

            // Tìm kiếm đánh giá theo userId và roomId
            const review = await Review.findOne({ userId, roomId });

            if (!review) {
                return res.status(404).json({ message: "Người dùng chưa đánh giá phòng này." });
            }

            res.status(200).json(review);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
}

module.exports = new reviewController();
