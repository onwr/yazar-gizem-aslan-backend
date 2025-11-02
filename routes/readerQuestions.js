const express = require("express");
const router = express.Router();
const ReaderQuestion = require("../models/ReaderQuestion");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const questions = await ReaderQuestion.getAll(page, limit);
    res.json({
      success: true,
      questions: questions || [],
    });
  } catch (error) {
    console.error("Sorular getirilirken hata:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      questions: [],
    });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.is_admin) {
      const canAsk = await ReaderQuestion.canUserAskQuestion(
        req.body.user_name
      );
      if (!canAsk.canAsk) {
        return res.status(429).json({
          error: `Yeni soru sormak için ${canAsk.remainingMinutes} dakika beklemelisiniz.`,
          remainingMinutes: canAsk.remainingMinutes,
        });
      }
    }
    const result = await ReaderQuestion.create(req.body);
    res.status(201).json({
      success: true,
      message: "Soru başarıyla eklendi",
      id: result.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    const userIp = req.ip;
    const result = await ReaderQuestion.like(req.params.id, userIp);
    res.json({
      success: true,
      likes: result.likes,
      message: "Beğeni işlemi başarılı",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.json({
        success: true,
        likes: error.likes,
        message: "Daha önce beğenilmiş",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Beğeni işlemi başarısız",
      });
    }
  }
});

router.post("/:id/admin-like", verifyToken, async (req, res) => {
  try {
    await ReaderQuestion.adminLike(req.params.id, req.user.id);
    res.json({ message: "Admin beğenisi eklendi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Önce daha spesifik route'lar (answers ile başlayanlar)
router.delete("/answers/:id", verifyToken, async (req, res) => {
  try {
    const success = await ReaderQuestion.deleteAnswer(req.params.id);
    if (success) {
      res.json({ message: "Cevap başarıyla silindi" });
    } else {
      res.status(404).json({ error: "Cevap bulunamadı" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/answers/:id/reply", async (req, res) => {
  try {
    const result = await ReaderQuestion.addReply(req.params.id, req.body);
    res
      .status(201)
      .json({ message: "Yanıt başarıyla eklendi", id: result.insertId });
  } catch (error) {
    if (error.message.includes("bekle")) {
      res.status(429).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.delete("/replies/:id", verifyToken, async (req, res) => {
  try {
    const success = await ReaderQuestion.deleteReply(req.params.id);
    if (success) {
      res.json({ message: "Yanıt başarıyla silindi" });
    } else {
      res.status(404).json({ error: "Yanıt bulunamadı" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sonra daha genel route'lar
router.post("/:id/answer", async (req, res) => {
  try {
    const result = await ReaderQuestion.addAnswer(req.params.id, req.body);
    res
      .status(201)
      .json({ message: "Cevap başarıyla eklendi", id: result.insertId });
  } catch (error) {
    if (error.message.includes("bekle")) {
      res.status(429).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await ReaderQuestion.softDelete(req.params.id);
    res.json({ message: "Soru silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
