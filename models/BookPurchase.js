const { pool } = require("../config/database");

class BookPurchase {
  static async getAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT bpl.*, b.kitapAd, b.resim 
        FROM book_purchase_links bpl
        JOIN books b ON b.kitapId = bpl.book_id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    const { book_id, price, store_url, store_name } = data;
    try {
      const [result] = await pool.execute(
        "INSERT INTO book_purchase_links (book_id, price, store_url, store_name) VALUES (?, ?, ?, ?)",
        [book_id, price, store_url, store_name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { price, store_url, store_name } = data;
    try {
      const [result] = await pool.execute(
        "UPDATE book_purchase_links SET price = ?, store_url = ?, store_name = ? WHERE id = ?",
        [price, store_url, store_name, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM book_purchase_links WHERE id = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookPurchase;
