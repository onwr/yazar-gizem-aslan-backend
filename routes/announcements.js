const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const { verifyToken } = require("../middleware/auth");

// Get active announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create announcement (admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const announcement = await Announcement.create({
      title: req.body.title,
      content: req.body.content,
      is_active: req.body.is_active,
      link: req.body.link,
      image_url: req.body.image_url,
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update announcement (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Duyuru bulunamadı" });
    }

    const updatedAnnouncement = await Announcement.update(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      is_active: req.body.is_active,
      link: req.body.link,
      image_url: req.body.image_url,
    });
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete announcement (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Duyuru bulunamadı" });
    }
    await Announcement.delete(req.params.id);
    res.json({ message: "Duyuru silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark announcement as read
router.post("/:id/read", async (req, res) => {
  try {
    const userIp = req.ip;
    await Announcement.markAsRead(req.params.id, userIp);
    res.json({ message: "Duyuru okundu olarak işaretlendi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
