import express from "express";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import { auth } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(auth);

app.use("/", postsRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`);
});