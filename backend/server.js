const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = new Database("database.db");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images

// Ensure uploads folder exists
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ---------------- TABLES ----------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL, 
    images TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`).run();

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/users", (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    ).run(name, email, password);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
app.get("/api/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products").all();
    // parse images JSON for each product
    products.forEach(p => {
      p.images = p.images ? JSON.parse(p.images) : [];
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- POST PRODUCTS ----------------
// Accept multiple images with 'images' field
app.post("/api/products", upload.array("images", 10), (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const images = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const result = db.prepare(
      "INSERT INTO products (name, description, price, stock, images) VALUES (?, ?, ?, ?, ?)"
    ).run(
      name,
      description,
      parseFloat(price),
      parseInt(stock),
      JSON.stringify(images)
    );

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- START SERVER ----------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
