import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http, { createServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import contactRoutes from "./routes/contact.route";

dotenv.config(); // Load config

const app = express();
const server: Server = createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: "http://localhost:5173" })); // Allow CORS for local development

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
app.use("/api/contact", contactRoutes);
app.use(express.static("public"));

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
