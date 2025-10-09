import express from "express";
import crypto from "crypto";
import pool from "../db/pool.js";

const router = express.Router();
const SESSION_TTL_HOURS = Number(process.env.SESSION_TTL_HOURS || 24);

router.post("/demo-login", async (req, res) => {
  try {
    const wanted = (req.body?.username || "").trim().slice(0, 32);

    // find or create user
    const user =
      (await pool.query("SELECT * FROM users WHERE username=$1", [wanted])).rows[0] ||
      (await pool.query(
        "INSERT INTO users (username, display_name) VALUES ($1, $1) RETURNING *",
        [wanted]
      )).rows[0];

    // create session
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 3600_000);

    await pool.query(
      "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
      [user.id, tokenHash, expiresAt]
    );

    // httpOnly cookie
    res.cookie("sid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true if serving over HTTPS
      expires: expiresAt,
    });

    res.json({ user });
  } catch (e) {
    console.error("demo-login failed:", e);
    res.status(500).json({ error: "login failed" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies?.sid;
    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      await pool.query("DELETE FROM sessions WHERE token_hash=$1", [tokenHash]);
    }
    res.clearCookie("sid");
    res.status(204).end();
  } catch (e) {
    res.clearCookie("sid");
    res.status(204).end();
  }
});

router.get("/me", (req, res) => {
  res.json({ user: req.user || null });
});

export default router;