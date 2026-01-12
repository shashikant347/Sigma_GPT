import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.log("DB connection failed", err);
  }
};

connectDB();
