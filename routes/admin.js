const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { verifyToken } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res
        .status(401)
        .json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    const isValidPassword = await Admin.verifyPassword(
      password,
      admin.password
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.get("/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
