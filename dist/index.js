"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db").default;
dotenv.config(); // Load config
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: "http://localhost:5173" })); // Allow CORS for local development
// Database connection
connectDB();
// Route imports
const reviewRoutes = require("./routes/review.route");
const businessRoutes = require("./routes/business.route");
const authRoutes = require("./routes/auth.route");
// Apply routes
app.use("/api/review", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
// app.use("/api/user", typedVerifyToken, userRoutes);
app.use(express.static("public"));
// Catch-all route
// app.get("*", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
