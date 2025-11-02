const { pool, redis } = require("../config/database");

class NewsFlow {
  static async create(title, image, link, sira = 0, isActive = true) {
    try {
      if (!title || !image || !link) {
        throw new Error("Tüm alanlar zorunludur");
      }

      const [result] = await pool.execute(
        "INSERT INTO news_flow (title, image, link, sira, isActive) VALUES (?, ?, ?, ?, ?)",
        [title, image, link, sira, isActive]
      );

      if (redis) {
        await redis.del("news_flow:all");
      }

      return result;
    } catch (error) {
      console.error("Create news flow error:", error);
      throw error;
    }
  }

  static async getAll(includeInactive = false) {
    try {
      const query = includeInactive
        ? "SELECT * FROM news_flow ORDER BY sira ASC"
        : "SELECT * FROM news_flow WHERE isActive = true ORDER BY sira ASC";

      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, title, image, link, sira, isActive) {
    try {
      const [result] = await pool.execute(
        "UPDATE news_flow SET title = ?, image = ?, link = ?, sira = ?, isActive = ? WHERE id = ?",
        [title, image, link, sira, isActive, id]
      );

      if (redis) {
        await redis.del("news_flow:all");
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM news_flow WHERE id = ?",
        [id]
      );

      if (redis) {
        await redis.del("news_flow:all");
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NewsFlow;
