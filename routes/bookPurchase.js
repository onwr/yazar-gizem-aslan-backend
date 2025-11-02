const express = require("express");
const router = express.Router();
const BookPurchase = require("../models/BookPurchase");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const links = await BookPurchase.getAll();
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const result = await BookPurchase.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const result = await BookPurchase.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await BookPurchase.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
