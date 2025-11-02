const express = require("express");
const router = express.Router();
const ChapterComment = require("../models/Comment");
const { verifyToken } = require("../middleware/auth");

router.post("/:chapterId", async (req, res, next) => {
  const { username, email, yorum, isAdmin } = req.body;
  const chapterId = req.params.chapterId;

  try {
    if (!username || !email || !yorum || !chapterId) {
      return res.status(400).json({
        error: "Tüm alanlar zorunludur (username, email, yorum, chapterId).",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Geçerli bir email adresi giriniz.",
      });
    }

    const result = await ChapterComment.create(
      chapterId,
      username,
      email,
      yorum,
      isAdmin
    );

    res.status(201).json({
      message: "Yorum başarıyla eklendi",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({
      error: "Yorum eklenirken bir hata oluştu: " + error.message,
    });
  }
});

router.post("/:commentId/reply", async (req, res, next) => {
  const { username, email, yorum, isAdmin } = req.body;
  const commentId = req.params.commentId;

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

    const result = await ChapterComment.createReply(
      commentId,
      username,
      email,
      yorum,
      isAdmin
    );

    res.status(201).json({
      message: "Yanıt başarıyla eklendi",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({
      error: "Yanıt eklenirken bir hata oluştu: " + error.message,
    });
  }
});

router.get("/chapter/:chapterId", async (req, res, next) => {
  try {
    const comments = await ChapterComment.getByChapterId(req.params.chapterId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const result = await ChapterComment.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Yorum bulunamadı" });
    }
    res.json({ message: "Yorum başarıyla silindi" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
