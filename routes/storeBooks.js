const express = require("express");
const router = express.Router();
const StoreBook = require("../models/StoreBook");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const books = await StoreBook.getAll();
    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const result = await StoreBook.create(req.body);
    res.status(201).json({
      message: "Kitap başarıyla eklendi",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await StoreBook.delete(req.params.id);
    res.json({ message: "Kitap başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
