"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const contact_route_1 = __importDefault(require("./routes/contact.route"));
dotenv_1.default.config(); // Load config
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// Middlewares
app.use(express_1.default.json()); // Parse JSON bodies
app.use((0, cors_1.default)({ origin: "http://localhost:5173" })); // Allow CORS for local development
// Database connection
const connectDB = require("./config/db").default;
connectDB();
// Route imports
const reviewRoutes = require("./routes/review.route");
const businessRoutes = require("./routes/business.route");
const authRoutes = require("./routes/auth.route");
// Apply routes
app.use("/api/review", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/contact", contact_route_1.default);
app.use(express_1.default.static("public"));
// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Handle Socket.IO connections
// io.on("connection", (socket) => {
//   console.log("A user connected");
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });
