const Room = require("../models/Room"); // Import mô hình Room

class aiController {
  // Tìm phòng theo vị trí
  searchByLocation = async (req, res) => {
    try {
      const location = req.query.location;
      if (!location) {
        return res.status(400).json({ message: "Vị trí không được để trống" });
      }

      const rooms = await Room.find({ location: { $regex: location, $options: 'i' } });
      if (rooms.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy phòng theo vị trí này" });
      }
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi tìm kiếm phòng", error: error.message });
    }
  };

  // Tìm phòng theo loại phòng
  searchByRoomType = async (req, res) => {
    try {
      const typeRoom = req.query.typeRoom;
      if (!typeRoom) {
        return res.status(400).json({ message: "Loại phòng không được để trống" });
      }

      const rooms = await Room.find({ typeRoom: { $regex: typeRoom, $options: 'i' } });
      if (rooms.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy phòng với loại phòng này" });
      }
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi tìm kiếm phòng", error: error.message });
    }
  };

  // Tìm phòng theo mức giá
  searchByPrice = async (req, res) => {
    try {
      const minPrice = req.query.minPrice || 0;
      const maxPrice = req.query.maxPrice || Infinity;

      const rooms = await Room.find({
        price: { $gte: minPrice, $lte: maxPrice }
      });

      if (rooms.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy phòng trong khoảng giá này" });
      }
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi tìm kiếm phòng", error: error.message });
    }
  };

  
  async getRoomByName(req, res) {
    try {
        const { name } = req.params; // Lấy tên phòng từ URL (dùng params)
        const room = await Room.findOne({ name: name }); // Tìm phòng theo tên

        if (!room) {
            return res.status(404).json({ message: "Room not found" }); // Nếu không tìm thấy phòng
        }

        return res.status(200).json(room); // Trả về thông tin phòng nếu tìm thấy
    } catch (error) {
        return res.status(500).json({ message: "Server error", error }); // Lỗi server
    }
}
}

module.exports = new aiController();
