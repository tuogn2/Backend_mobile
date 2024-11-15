// Import necessary modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const db = require("./src/configs/db/index.js");
const router = require("./src/routes/index.js");
const { swaggerUi, swaggerDocs } = require("./src/configs/swagger.js");
const cloudinary = require("cloudinary").v2;
const upload = require("./src/middleware/upload.js");
const chatHandler = require("./src/socket/chatHandler.js");

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Set up HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://172.26.16.1:8081",
      "exp://192.168.1.3:8081",
      "http://192.168.1.13:8081",
      "exp://192.168.1.13:8081",
      "http://localhost:8081",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "src/public")));
app.use(morgan("combined"));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://172.26.16.1:8081",
      "exp://192.168.1.3:8081",
      "http://192.168.1.13:8081",
      "exp://192.168.1.13:8081",
      "http://localhost:8081",
    ],
    credentials: true,
  })
);

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Cloudinary configuration
cloudinary.config({
  cloud_name: "drjoyphxe",
  api_key: "837168631483714",
  api_secret: process.env.SECRET_KEY,
});

// Database connection
db.connect();




// Set up routes with upload middleware
router(app, upload);

// Set up chat handler for Socket.IO
chatHandler(io);

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
