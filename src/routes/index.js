const UserRouter = require("./UserRouter");
const authRouter = require("./auth");
const roomRouter = require("./room");
const reviewRouter = require("./review");
const favoriteRouter = require("./favorite");
const bookingRouter = require("./booking");
const paymentRouter = require("./payment");
const aiRouter = require("./ai");
const socket = require("./socket")
function router(app) {
  app.use("/api/v1/users", UserRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/rooms", roomRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/favories", favoriteRouter);
  app.use("/api/v1/bookings", bookingRouter);
  app.use("/api/v1/payments", paymentRouter);
  app.use("/api/v1/ai", aiRouter);
  app.use("/api/v1/socket",socket)
}

module.exports = router;
