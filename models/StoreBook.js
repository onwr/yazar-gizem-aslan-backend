const { pool } = require("../config/database");

class StoreBook {
  static async getAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM store_books ORDER BY created_at DESC"
    );
    return rows;
  }

  static async create(book) {
    const [result] = await pool.execute(
      "INSERT INTO store_books (title, image_url, purchase_url) VALUES (?, ?, ?)",
      [book.title, book.image_url, book.purchase_url]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM store_books WHERE id = ?",
      [id]
    );
    return result;
  }
}

module.exports = StoreBook;
