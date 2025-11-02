const { pool, redis } = require("../config/database");

class LineComment {
  static async create(
    chapterId,
    lineNumber,
    username,
    email,
    yorum,
    isAdmin = false
  ) {
    try {
      if (!chapterId || !lineNumber || !username || !email || !yorum) {
        throw new Error("Tüm alanlar zorunludur");
      }

      const chapter_id = parseInt(chapterId);
      const line_number = parseInt(lineNumber);

      if (isNaN(chapter_id) || isNaN(line_number)) {
        throw new Error("Geçersiz chapter ID veya satır numarası");
      }

      const [result] = await pool.execute(
        "INSERT INTO line_comments (chapterId, lineNumber, username, email, yorum, isAdmin) VALUES (?, ?, ?, ?, ?, ?)",
        [chapter_id, line_number, username, email, yorum, isAdmin]
      );

      if (redis) {
        await redis.del(`chapter:${chapter_id}`);
      }

      return result;
    } catch (error) {
      console.error("Create line comment error:", error);
      throw error;
    }
  }

  static async getByChapterIdAndLine(chapterId, lineNumber) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM line_comments WHERE chapterId = ? AND lineNumber = ? ORDER BY created_at DESC",
        [chapterId, lineNumber]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByChapterId(chapterId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM line_comments WHERE chapterId = ? ORDER BY lineNumber ASC, created_at DESC",
        [chapterId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM line_comments WHERE id = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LineComment;
