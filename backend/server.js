import express from "express";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import { auth } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/static", express.static(path.join(__dirname, "static")));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(auth);

app.use("/", postsRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});