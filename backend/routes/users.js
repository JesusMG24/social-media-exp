import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

router.get('/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const userResult = await pool.query(
            `SELECT id, username, avatar_url FROM users WHERE id = $1`,
            [userid]
        );
        res.json(userResult.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:userid/posts', async (req, res) => {
    const { userid } = req.params;
    try {
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit ?? "10", 10)));
        const offset = Math.max(0, parseInt(req.query.offset ?? "0", 10));

        const { rows } = await pool.query(
            `SELECT
            p.id, p.title, p.content, p.created_at, p.updated_at,
            u.username AS author,  u.id AS author_id, u.avatar_url
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC, p.id DESC
            LIMIT $2 OFFSET $3`,
            [userid, limit, offset]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;