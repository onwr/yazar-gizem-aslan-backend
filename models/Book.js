const { pool, redis } = require("../config/database");

class Book {
  static async getById(id) {
    const cacheKey = `book:${id}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
      const [rows] = await pool.execute(
        "SELECT * FROM books WHERE kitapId = ?",
        [id]
      );
      if (rows[0]) {
        await redis.set(cacheKey, JSON.stringify(rows[0]), "EX", 300);
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async incrementReadingCount(bookId) {
    const query =
      "UPDATE books SET okumaSayi = okumaSayi + 1 WHERE kitapId = ?";
    const [result] = await pool.execute(query, [bookId]);
    return result;
  }

  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    try {
      // LIMIT ve OFFSET için query kullanımı
      const [rows] = await pool.query(
        `SELECT * FROM books LIMIT ${parseInt(limit)} OFFSET ${parseInt(
          offset
        )}`
      );

      const [count] = await pool.query("SELECT COUNT(*) as total FROM books");
      return {
        books: rows,
        total: count[0].total,
        page,
        totalPages: Math.ceil(count[0].total / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(bookData) {
    try {
      const kitapId = bookData.kitapId || null;
      const kitapAd = bookData.kitapAd || null;
      const okumaSayi = bookData.okumaSayi || 0;
      const aciklama = bookData.aciklama || null;
      const resim = bookData.resim || null;

      if (!kitapId || !kitapAd) {
        throw new Error("kitapId ve kitapAd zorunlu alanlardır");
      }

      const [result] = await pool.execute(
        "INSERT INTO books (kitapId, kitapAd, okumaSayi, aciklama, resim) VALUES (?, ?, ?, ?, ?)",
        [kitapId, kitapAd, okumaSayi, aciklama, resim]
      );

      return {
        success: true,
        id: result.insertId,
        message: "Kitap başarıyla eklendi",
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, bookData) {
    try {
      // Önce mevcut kitabı al
      const [rows] = await pool.execute(
        "SELECT * FROM books WHERE kitapId = ?",
        [id]
      );

      if (!rows.length) {
        return { affectedRows: 0 };
      }

      const currentBook = rows[0];

      // Gelen verilerle mevcut verileri birleştir
      const kitapAd =
        bookData.kitapAd !== undefined ? bookData.kitapAd : currentBook.kitapAd;
      const okumaSayi =
        bookData.okumaSayi !== undefined
          ? bookData.okumaSayi
          : currentBook.okumaSayi;
      const aciklama =
        bookData.aciklama !== undefined
          ? bookData.aciklama
          : currentBook.aciklama;
      const resim =
        bookData.resim !== undefined ? bookData.resim : currentBook.resim;

      const [result] = await pool.execute(
        "UPDATE books SET kitapAd = ?, okumaSayi = ?, aciklama = ?, resim = ? WHERE kitapId = ?",
        [kitapAd, okumaSayi, aciklama, resim, id]
      );

      await redis.del(`book:${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM books WHERE kitapId = ?",
        [id]
      );
      await redis.del(`book:${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Book;
