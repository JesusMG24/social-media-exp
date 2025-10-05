import crypto from "crypto";
import pool from "../db/pool.js";

export async function auth(req, _res, next) {
  try {
    const cookie = req.cookies?.sid;
    if (!cookie) return next();

    const tokenHash = crypto.createHash("sha256").update(cookie).digest("hex");
    const { rows } = await pool.query(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > now()`,
      [tokenHash]
    );
    if (rows[0]) req.user = rows[0];
  } catch (e) {
    console.error("auth middleware error:", e);
  }
  next();
}