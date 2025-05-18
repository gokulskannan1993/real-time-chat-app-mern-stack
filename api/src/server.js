import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
