const Room = require("../models/Room"); // Import mô hình Room

class roomController {
    
    // Thêm một phòng mới
    async addRoom(req, res) {
        try {
            const { name, description, price, location, listImage, services, typeRoom, typeArea, quantity } = req.body;
            
            // Kiểm tra dữ liệu đầu vào
            if (!name || !description || !price || !location || !typeRoom || !typeArea || !quantity) {
                return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin phòng." });
            }

            // Tạo phòng mới
            const newRoom = new Room({
                name,
                description,
                price,
                location,
                listImage: listImage || [], // Nếu không có hình ảnh, mặc định là mảng rỗng
                services,
                typeRoom,
                typeArea,
                quantity,
            });

            // Lưu phòng vào database
            await newRoom.save();
            res.status(201).json({ message: "Thêm phòng thành công!", room: newRoom });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    // Lấy tất cả các phòng
    async getAllRooms(req, res) {
        try {
            const rooms = await Room.find(); // Lấy tất cả các phòng từ database
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    // Lấy phòng theo thể loại
    async getRoomsByType(req, res) {
        try {
            const { typeRoom } = req.params; // Thể loại phòng từ URL
            const rooms = await Room.find({ typeRoom }); // Tìm các phòng theo thể loại
            if (rooms.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phòng với thể loại này." });
            }
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
}

module.exports = new roomController();
