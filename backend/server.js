const express = require("express");
const mysql = require("mysql2");

const app = express();
//For react connection for login and signup
const cors = require("cors");
app.use(cors());
app.use(express.json());

//signup api
const bcrypt = require("bcrypt");

app.post("/signup", (req, res) => {

  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, hashedPassword], (err) => {

    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({ message: "Email already exists" });
      }
      return res.json({ message: "Error in signup" });
    }

    res.json({ message: "User registered successfully" });
  });
});
//login api
const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, result) => {

    if (err || result.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });
  });
});
//token verfication

function verifyToken(req, res, next) {

  const token = req.headers["authorization"];

  if (!token) {
    return res.json({ message: "No token provided" });
  }

  jwt.verify(token, "secretkey", (err, decoded) => {

    if (err) {
      return res.json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

app.get("/users", verifyToken, (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    res.json(result);
  });
});
app.get("/dashboard", verifyToken, (req, res) => {

  res.json({
    message: "Welcome to protected dashboard"
  });

});



const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "users"
});
db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to MySQL");
  }
});

//Post api
app.post("/users", (req, res) => {

  const { name, email, role } = req.body;

  const sql =
    "INSERT INTO users (name, email, role) VALUES (?, ?, ?)";

  db.query(sql, [name, email, role], (err, result) => {

    if (err) {

      if (err.code === "ER_DUP_ENTRY") {
        return res.json({
          message: "Email already exists"
        });
      }
      if (!email.includes("@")) {
   return res.json({
      message: "Invalid email"
   });
}

    res.status(500).json({
  success: false,
  message: "Internal server error"
});
    }

    res.json({
      message: "User created successfully"
    });
  });
});
//Get api
app.get("/users", (req, res) => {

  const sql = "SELECT * FROM users";

  db.query(sql, (err, result) => {

    if (err) {
    res.status(500).json({
  success: false,
  message: "Internal server error"
});
    }

    res.json(result);
  });
});
//put(update) api
app.put("/users/:id", (req, res) => {

  const id = req.params.id;
  const { name, email, role } = req.body;

  const sql =
    "UPDATE users SET name=?, email=?, role=? WHERE id=?";

  db.query(sql,
    [name, email, role, id],
    (err, result) => {

      if (err) {
     res.status(500).json({
  success: false,
  message: "Internal server error"
});
      }

      res.json({
        message: "User updated successfully"
      });
    });
});
//delete api
app.delete("/users/:id", (req, res) => {

  const id = req.params.id;

  const sql =
    "DELETE FROM users WHERE id=?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      res.status(500).json({
  success: false,
  message: "Internal server error"
});
    }

    res.json({
      message: "User deleted successfully"
    });
  });
});

//Sever start
app.listen(3000, () => {
  console.log("Server running on port 3000");
});