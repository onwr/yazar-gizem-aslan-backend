const express = require("express");
const router = express.Router();
const SigningEvent = require("../models/SigningEvent");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const events = await SigningEvent.getAll();
    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const result = await SigningEvent.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const result = await SigningEvent.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Etkinlik bulunamadı" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const result = await SigningEvent.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Etkinlik bulunamadı" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
