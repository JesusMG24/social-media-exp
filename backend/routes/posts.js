import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/posts", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit ?? "10", 10)));
    const offset = Math.max(0, parseInt(req.query.offset ?? "0", 10));

    const { rows } = await pool.query(
      `SELECT
      p.id, p.title, p.content, p.created_at, p.updated_at,
      u.username AS author, u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
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

    const inserted = await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id",
      [req.user.id, title, content]
    );

    const { rows } = await pool.query(
      `SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
              u.username AS author, u.avatar_url
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE p.id = $1`,
      [inserted.rows[0].id]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error("POST /posts failed:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/posts", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "login first" });
    
    const { id, title, content } = req.body || {};
    if (!id || !title || !content) {
      return res.status(400).json({ error: "id, title and content are required" })
    }
    
    const updated = await pool.query(
      `UPDATE posts
        SET title = $1, content = $2, updated_at = now()
      WHERE id = $3 AND user_id = $4
      RETURNING id`,
      [title, content, id, req.user.id]
    );

    if (updated.rowCount === 0) {
      return res.status(403).json({ error: "not allowed or post not found" });
    }

    const { rows } = await pool.query(
      `SELECT p.id, p.content, p.created_at,
              u.username AS author, u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = $1`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    const deleted = await pool.query(
      `DELETE FROM posts WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (deleted.rowCount === 0) return res.status(404).json({ error: "not found" });
    return res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;