const express = require("express");
const router = express.Router();
const LineComment = require("../models/LineComment");
const { verifyToken } = require("../middleware/auth");

router.post("/:chapterId/:lineNumber", async (req, res, next) => {
  const { username, email, yorum, isAdmin } = req.body;
  const { chapterId, lineNumber } = req.params;

  try {
    if (!username || !email || !yorum) {
      return res.status(400).json({
        error: "Tüm alanlar zorunludur (username, email, yorum).",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Geçerli bir email adresi giriniz.",
      });
    }

    const result = await LineComment.create(
      chapterId,
      lineNumber,
      username,
      email,
      yorum,
      isAdmin
    );

    res.status(201).json({
      message: "Satır yorumu başarıyla eklendi",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({
      error: "Satır yorumu eklenirken bir hata oluştu: " + error.message,
    });
  }
});

router.get("/chapter/:chapterId/line/:lineNumber", async (req, res, next) => {
  try {
    const comments = await LineComment.getByChapterIdAndLine(
      req.params.chapterId,
      req.params.lineNumber
    );
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.get("/chapter/:chapterId", async (req, res, next) => {
  try {
    const comments = await LineComment.getByChapterId(req.params.chapterId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const result = await LineComment.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Yorum bulunamadı" });
    }
    res.json({ message: "Yorum başarıyla silindi" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
