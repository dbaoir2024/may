import express from 'express';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'edrms_user',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'edrms',
  password: process.env.DB_PASSWORD || 'edrms_password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

app.use(express.json());

// Test endpoint
app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() as current_time');
    res.json({ status: 'Server is running', dbTime: rows[0].current_time });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});