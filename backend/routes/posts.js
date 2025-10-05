import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/posts", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts ORDER BY updated_at DESC");
    res.json(rows);
  } catch (error) {
    console.error("GET /posts failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "login first" });
    const { title, content } = req.body || {};
    const { rows } = await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, content]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error("POST /posts failed:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;