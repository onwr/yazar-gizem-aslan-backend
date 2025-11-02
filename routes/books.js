const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const books = await Book.getAll(page, limit);
    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.getById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }

    await Book.incrementReadingCount(req.params.id);

    res.json(book);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const result = await Book.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const result = await Book.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const result = await Book.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
