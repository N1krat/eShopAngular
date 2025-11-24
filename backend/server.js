const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecret123";
const db = new Database("database.db");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 


if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });


db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  );

  CREATE TABLE IF NOT EXISTS order_products (
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )
`).run();


app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


app.get("/users", (req, res) => {
  try {
    const users = db.prepare("SELECT id, email FROM users").all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body; 
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
    ).run(email, hashedPassword);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, email: user.email } }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
    ).run(email, hashedPassword);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get("/api/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products").all();
    products.forEach(p => {
      p.images = p.images ? JSON.parse(p.images) : [];
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  try {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

  
    product.images = product.images ? JSON.parse(product.images) : [];
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db.prepare(
      "INSERT INTO products (name, description, price, stock, images) VALUES (?, ?, ?, ?, ?)"
    ).run(
      name,
      description,
      parseFloat(price),
      parseInt(stock),
      image ? JSON.stringify([image]) : JSON.stringify([])
    );

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  try {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.images) {
      const imagesArray = JSON.parse(product.images);
      imagesArray.forEach(imgPath => {
        const filePath = path.join(__dirname, imgPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    
    db.prepare("DELETE FROM products WHERE id = ?").run(id);

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/orders", (req, res) => {
  try {
    const orders = db.prepare("SELECT * FROM orders").all();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
