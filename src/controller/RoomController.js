const Room = require("../models/Room"); // Import mô hình Room
const User = require("../models/User"); // Import mô hình User
const Booking = require("../models/Booking"); // Import mô hình Booking
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


    async searchRooms(req, res) {
        try {
            const { location, startDate, endDate } = req.query;
    
            // Kiểm tra các trường bắt buộc đã có
            if (!location || !startDate || !endDate) {
                return res.status(400).json({ message: "Vui lòng cung cấp location, startDate và endDate để tìm kiếm." });
            }
    
            // Chuyển đổi startDate và endDate thành đối tượng Date
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            // Tìm các phòng có vị trí phù hợp
            const rooms = await Room.find({
                location: { $regex: new RegExp(location, "i") }, // Khớp không phân biệt chữ hoa/thường và tìm kiếm một phần vị trí
            });
    
            // Lọc các phòng đã có đặt phòng trong thời gian này
            const availableRooms = [];
    
            for (let room of rooms) {
                // Kiểm tra các booking đã có cho phòng này trong khoảng thời gian đã chọn
                const existingBookings = await Booking.find({
                    roomId: room._id,
                    $or: [
                        { checkInDate: { $lt: end }, checkOutDate: { $gte: start } }, // booking đã được đặt trong khoảng thời gian yêu cầu
                        { checkInDate: { $gte: start }, checkInDate: { $lt: end } },  // booking bắt đầu trong khoảng thời gian yêu cầu
                        { checkOutDate: { $gt: start }, checkOutDate: { $lte: end } }, // booking kết thúc trong khoảng thời gian yêu cầu
                    ],
                });
    
                // Nếu không có booking trùng thì thêm phòng vào danh sách phòng có sẵn
                if (existingBookings.length === 0) {
                    availableRooms.push(room);
                }
            }
    
            if (availableRooms.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phòng trống với vị trí và khoảng thời gian đã chọn." });
            }
    
            res.status(200).json(availableRooms);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
    
    
    async getRoomsByIds(req, res) {
        try {
            const { roomIds } = req.body; // roomIds is an array of room IDs from the user's favorites

            // Find rooms by their IDs
            const rooms = await Room.find({ '_id': { $in: roomIds } });

            if (rooms.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phòng nào với danh sách ID này." });
            }

            // You can optionally add logic to check if the room is a favorite of the user
            // Since you already passed roomIds, you could add a "isFavorite" field here if necessary

            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }

    async getRoomById(req, res) {
        try {
            const { roomId } = req.params; // roomId from the URL parameter
    
            // Find the room by its ID
            const room = await Room.findById(roomId);
    
            if (!room) {
                return res.status(404).json({ message: "Không tìm thấy phòng với ID này." });
            }
    
            res.status(200).json(room);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
    // Lấy phòng theo thể loại
    async getRoomsByType(req, res) {
        try {
            const { typeRoom, userid } = req.params; // Room type and user ID from URL
    
            // Find the user to get their favorites list
            const user = await User.findById(userid);
            const userFavorites = user ? user.favorites : []; // Assuming 'favorites' is an array of room IDs
    
            // Find rooms by type
            const rooms = await Room.find({ typeRoom });
    
            if (rooms.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phòng với thể loại này." });
            }
    
            // Add isFavorite property to each room based on user's favorites
            const roomsWithFavoriteStatus = rooms.map(room => ({
                ...room.toObject(),
                isFavorite: userFavorites.includes(room._id) // Check if room ID is in user's favorites
            }));
    
            res.status(200).json(roomsWithFavoriteStatus);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
    
}

module.exports = new roomController();
