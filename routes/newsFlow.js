const express = require("express");
const router = express.Router();
const NewsFlow = require("../models/NewsFlow");
const { verifyToken } = require("../middleware/auth");

// Tüm haber akışı öğelerini getir
router.get("/", async (req, res) => {
  try {
    const newsItems = await NewsFlow.getAll(false);
    res.json({ success: true, newsItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Tüm haber akışı öğelerini getir (aktif olmayanlar dahil)
router.get("/admin", verifyToken, async (req, res) => {
  try {
    const newsItems = await NewsFlow.getAll(true);
    res.json({ success: true, newsItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Yeni haber akışı öğesi ekle
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, image, link, sira } = req.body;
    const result = await NewsFlow.create(title, image, link, sira);
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Haber akışı öğesini güncelle
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, image, link, isActive, sira } = req.body;
    const result = await NewsFlow.update(
      req.params.id,
      title,
      image,
      link,
      sira,
      isActive
    );
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Haber akışı öğesini sil
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await NewsFlow.delete(req.params.id);
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
