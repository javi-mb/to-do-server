import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER || "admin",
  host: process.env.POSTGRES_HOST || "postgres",
  database: process.env.POSTGRES_DB || "todo_db",
  password: process.env.POSTGRES_PASSWORD || "password",
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
});

// Crear tabla si no existe
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'tasks' is ready");
  } catch (err) {
    console.error("Error creating table", err);
  }
};

createTable();

app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks");
  res.json(result.rows);
});

app.post("/tasks", async (req, res) => {
  const { task } = req.body;
  await pool.query("INSERT INTO tasks (task) VALUES ($1)", [task]);
  res.status(201).send("Task added");
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  res.send("Task deleted");
});

app.listen(3001, () => console.log("Server running on port 3001"));

