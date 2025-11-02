const { pool } = require("../config/database");

class Announcement {
  static async findAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM announcements WHERE is_active = true ORDER BY created_at DESC"
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM announcements WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async create(announcement) {
    const {
      title,
      content,
      is_active = true,
      link = null,
      image_url = null,
    } = announcement;
    const [result] = await pool.execute(
      "INSERT INTO announcements (title, content, is_active, link, image_url) VALUES (?, ?, ?, ?, ?)",
      [title, content, is_active, link, image_url]
    );
    return { id: result.insertId, title, content, is_active, link, image_url };
  }

  static async update(id, announcement) {
    const { title, content, is_active, link, image_url } = announcement;

    // Mevcut duyuruyu al
    const currentAnnouncement = await this.findById(id);
    if (!currentAnnouncement) {
      throw new Error("Duyuru bulunamadı");
    }

    // Undefined değerleri mevcut değerlerle değiştir
    const updatedAnnouncement = {
      title: title ?? currentAnnouncement.title,
      content: content ?? currentAnnouncement.content,
      is_active: is_active ?? currentAnnouncement.is_active,
      link: link ?? currentAnnouncement.link,
      image_url: image_url ?? currentAnnouncement.image_url,
    };

    const [result] = await pool.execute(
      "UPDATE announcements SET title = ?, content = ?, is_active = ?, link = ?, image_url = ? WHERE id = ?",
      [
        updatedAnnouncement.title,
        updatedAnnouncement.content,
        updatedAnnouncement.is_active,
        updatedAnnouncement.link,
        updatedAnnouncement.image_url,
        id,
      ]
    );
    return { id, ...updatedAnnouncement };
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM announcements WHERE id = ?",
      [id]
    );
    return result;
  }

  static async markAsRead(announcementId, userIp) {
    try {
      await pool.execute(
        "INSERT INTO announcement_reads (announcement_id, user_ip) VALUES (?, ?)",
        [announcementId, userIp]
      );
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return;
      }
      throw error;
    }
  }
}

module.exports = Announcement;
