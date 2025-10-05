import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL}
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    };

if (process.env.DATABASE_SSL === "true") {
  config.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(config);

export default pool;