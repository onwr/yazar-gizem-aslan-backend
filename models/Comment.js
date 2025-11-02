const { pool, redis } = require("../config/database");

class ChapterComment {
  static async create(chapterId, username, email, yorum, isAdmin = false) {
    try {
      if (!chapterId || !username || !email || !yorum) {
        throw new Error("Tüm alanlar zorunludur");
      }

      const chapter_id = parseInt(chapterId);
      if (isNaN(chapter_id)) {
        throw new Error("Geçersiz chapter ID");
      }

      const [result] = await pool.execute(
        "INSERT INTO chapter_comments (chapterId, username, email, yorum, isAdmin) VALUES (?, ?, ?, ?, ?)",
        [chapter_id, username, email, yorum, isAdmin]
      );

      if (redis) {
        await redis.del(`chapter:${chapter_id}`);
      }

      return result;
    } catch (error) {
      console.error("Create comment error:", error);
      throw error;
    }
  }

  static async createReply(commentId, username, email, yorum, isAdmin = false) {
    try {
      if (!commentId || !username || !email || !yorum) {
        throw new Error("Tüm alanlar zorunludur");
      }

      // First get the parent comment's chapterId
      const [parentComment] = await pool.execute(
        "SELECT chapterId FROM chapter_comments WHERE id = ?",
        [commentId]
      );

      if (!parentComment || parentComment.length === 0) {
        throw new Error("Parent comment not found");
      }

      // Insert reply with the same chapterId as parent
      const [result] = await pool.execute(
        "INSERT INTO chapter_comments (chapterId, parent_id, username, email, yorum, isAdmin) VALUES (?, ?, ?, ?, ?, ?)",
        [parentComment[0].chapterId, commentId, username, email, yorum, isAdmin]
      );

      return result;
    } catch (error) {
      console.error("Create reply error:", error);
      throw error;
    }
  }

  static async getByChapterId(chapterId) {
    try {
      const [rows] = await pool.execute(
        "SELECT c1.*, (SELECT COUNT(*) FROM chapter_comments c2 WHERE c2.parent_id = c1.id) as reply_count FROM chapter_comments c1 WHERE c1.chapterId = ? AND c1.parent_id IS NULL ORDER BY c1.created_at DESC",
        [chapterId]
      );

      for (let comment of rows) {
        const [replies] = await pool.execute(
          "SELECT * FROM chapter_comments WHERE parent_id = ? ORDER BY created_at ASC",
          [comment.id]
        );
        comment.replies = replies;
      }

      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM chapter_comments WHERE id = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChapterComment;
