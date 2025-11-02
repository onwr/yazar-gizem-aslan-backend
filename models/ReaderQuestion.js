const { pool } = require("../config/database");

class ReaderQuestion {
  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    try {
      const [questions] = await pool.execute(
        `
        SELECT 
          q.*,
          COUNT(DISTINCT ql.id) as likes,
          GROUP_CONCAT(DISTINCT ql.user_ip) as liked_by
        FROM reader_questions q
        LEFT JOIN question_likes ql ON q.id = ql.question_id
        WHERE q.deleted_at IS NULL
        GROUP BY q.id
        ORDER BY likes DESC, q.created_at DESC
        LIMIT ? OFFSET ?
        `,
        [String(limit), String(offset)]
      );

      if (questions.length > 0) {
        const placeholders = questions.map(() => "?").join(",");
        const questionIds = questions.map((q) => q.id);

        const [answers] = await pool.execute(
          `
          SELECT *
          FROM question_answers
          WHERE question_id IN (${placeholders})
          ORDER BY created_at ASC
          `,
          questionIds
        );

        // Her cevap için yanıtları al
        if (answers.length > 0) {
          const answerPlaceholders = answers.map(() => "?").join(",");
          const answerIds = answers.map((a) => a.id);

          const [replies] = await pool.execute(
            `
            SELECT *
            FROM answer_replies
            WHERE answer_id IN (${answerPlaceholders})
            ORDER BY created_at ASC
            `,
            answerIds
          );

          // Cevapları sorulara ekle ve her cevaba yanıtları ekle
          questions.forEach((question) => {
            question.answers = answers.filter(
              (a) => a.question_id === question.id
            );

            // Her cevaba yanıtları ekle
            question.answers.forEach((answer) => {
              answer.replies = replies.filter((r) => r.answer_id === answer.id);
            });
          });
        } else {
          questions.forEach((question) => {
            question.answers = [];
          });
        }
      }

      return {
        success: true,
        questions: questions || [],
        total: questions.length,
      };
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      return {
        success: false,
        error: "Sorular alınırken bir hata oluştu",
        questions: [],
      };
    }
  }

  static async canUserAskQuestion(userName) {
    try {
      const [lastQuestion] = await pool.execute(
        `SELECT created_at 
         FROM reader_questions 
         WHERE user_name = ? AND is_admin = 0 
         AND created_at > DATE_SUB(NOW(), INTERVAL 60 MINUTE)
         LIMIT 1`,
        [userName]
      );

      return {
        canAsk: lastQuestion.length === 0,
        remainingMinutes:
          lastQuestion.length > 0
            ? Math.ceil(
                60 -
                  (new Date() - new Date(lastQuestion[0].created_at)) /
                    1000 /
                    60
              )
            : 0,
      };
    } catch (error) {
      throw new Error("Soru gönderme kontrolü yapılırken hata oluştu");
    }
  }

  static async canUserAnswer(userName) {
    try {
      const [lastAnswer] = await pool.execute(
        `SELECT created_at 
         FROM question_answers 
         WHERE user_name = ? AND is_admin = 0 
         AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE)
         LIMIT 1`,
        [userName]
      );

      return {
        canAnswer: lastAnswer.length === 0,
        remainingMinutes:
          lastAnswer.length > 0
            ? Math.ceil(
                2 -
                  (new Date() - new Date(lastAnswer[0].created_at)) / 1000 / 60
              )
            : 0,
      };
    } catch (error) {
      throw new Error("Cevap gönderme kontrolü yapılırken hata oluştu");
    }
  }

  static async create({ user_name, question, is_admin }) {
    if (is_admin) {
      const [result] = await pool.execute(
        "INSERT INTO reader_questions (user_name, question, is_admin) VALUES (?, ?, ?)",
        [user_name, question, is_admin]
      );
      return { success: true, id: result.insertId };
    }

    const canAsk = await this.canUserAskQuestion(user_name);
    if (!canAsk.canAsk) {
      throw new Error(
        `Yeni soru sormak için ${canAsk.remainingMinutes} dakika beklemelisiniz.`
      );
    }

    const [result] = await pool.execute(
      "INSERT INTO reader_questions (user_name, question, is_admin) VALUES (?, ?, ?)",
      [user_name, question, is_admin]
    );
    return { success: true, id: result.insertId };
  }

  static async like(questionId, userIp) {
    try {
      await pool.execute(
        "INSERT INTO question_likes (question_id, user_ip) VALUES (?, ?)",
        [questionId, userIp]
      );

      const [result] = await pool.execute(
        "SELECT COUNT(*) as total FROM question_likes WHERE question_id = ?",
        [questionId]
      );

      return { likes: result[0].total };
    } catch (error) {
      const [result] = await pool.execute(
        "SELECT COUNT(*) as total FROM question_likes WHERE question_id = ?",
        [questionId]
      );

      return { likes: result[0].total };
    }
  }

  static async adminLike(questionId, adminId) {
    await pool.execute(
      "INSERT INTO question_likes (question_id, user_ip, is_admin) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE is_admin = TRUE",
      [questionId, adminId]
    );
    await pool.execute(
      "UPDATE reader_questions SET admin_liked = TRUE WHERE id = ?",
      [questionId]
    );
  }

  static async softDelete(questionId) {
    await pool.execute(
      "UPDATE reader_questions SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [questionId]
    );
  }

  static async hasUserLiked(questionId, userIp) {
    const [rows] = await pool.execute(
      "SELECT id FROM question_likes WHERE question_id = ? AND user_ip = ?",
      [questionId, userIp]
    );
    return rows.length > 0;
  }

  static async addAnswer(questionId, { user_name, answer, is_admin }) {
    if (!is_admin) {
      const canAnswer = await this.canUserAnswer(user_name);
      if (!canAnswer.canAnswer) {
        throw new Error(
          `Yeni cevap vermek için ${canAnswer.remainingMinutes} dakika beklemelisiniz.`
        );
      }
    }

    const [result] = await pool.execute(
      "INSERT INTO question_answers (question_id, user_name, answer, is_admin) VALUES (?, ?, ?, ?)",
      [questionId, user_name, answer, is_admin]
    );
    return result;
  }

  static async deleteAnswer(answerId) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM question_answers WHERE id = ?",
        [answerId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Cevap silinirken bir hata oluştu");
    }
  }

  static async canUserReply(userName) {
    try {
      const [lastReply] = await pool.execute(
        `SELECT created_at 
         FROM answer_replies 
         WHERE user_name = ? AND is_admin = 0 
         AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE)
         LIMIT 1`,
        [userName]
      );

      return {
        canReply: lastReply.length === 0,
        remainingMinutes:
          lastReply.length > 0
            ? Math.ceil(
                2 - (new Date() - new Date(lastReply[0].created_at)) / 1000 / 60
              )
            : 0,
      };
    } catch (error) {
      throw new Error("Yanıt gönderme kontrolü yapılırken hata oluştu");
    }
  }

  static async addReply(answerId, { user_name, reply, is_admin }) {
    if (!is_admin) {
      const canReply = await this.canUserReply(user_name);
      if (!canReply.canReply) {
        throw new Error(
          `Yeni yanıt vermek için ${canReply.remainingMinutes} dakika beklemelisiniz.`
        );
      }
    }

    const [result] = await pool.execute(
      "INSERT INTO answer_replies (answer_id, user_name, reply, is_admin) VALUES (?, ?, ?, ?)",
      [answerId, user_name, reply, is_admin]
    );
    return result;
  }

  static async deleteReply(replyId) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM answer_replies WHERE id = ?",
        [replyId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Yanıt silinirken bir hata oluştu");
    }
  }
}

module.exports = ReaderQuestion;
