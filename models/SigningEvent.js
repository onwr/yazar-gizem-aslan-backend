const { pool } = require("../config/database");

class SigningEvent {
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM signing_events ORDER BY event_date"
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(eventData) {
    const { title, description, location, event_date } = eventData;
    try {
      const [result] = await pool.execute(
        "INSERT INTO signing_events (title, description, location, event_date) VALUES (?, ?, ?, ?)",
        [title, description, location, event_date]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, eventData) {
    const { title, description, location, event_date } = eventData;
    try {
      const [result] = await pool.execute(
        "UPDATE signing_events SET title = ?, description = ?, location = ?, event_date = ? WHERE id = ?",
        [title, description, location, event_date, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM signing_events WHERE id = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SigningEvent;
