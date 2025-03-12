// backend/models/photoModel.js
const pool = require('../utils/dbClient');

class Photo {
  static async create({ id, userId, fileName, uploadedAt }) {
    const result = await pool.query(
      'INSERT INTO photos (id, user_id, file_name, uploaded_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, userId, fileName, uploadedAt]
    );
    return result.rows[0];
  }

  static async search({ userId, tag, date, size }) {
    let query = 'SELECT * FROM photos WHERE user_id = $1';
    const params = [userId];

    if (tag) {
      query += ' AND tags @> $2';
      params.push(tag);
    }
    if (date) {
      query += ' AND uploaded_at::date = $3';
      params.push(date);
    }
    if (size) {
      query += ' AND size <= $4';
      params.push(size);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(photoId) {
    const result = await pool.query('SELECT * FROM photos WHERE id = $1', [photoId]);
    return result.rows[0];
  }

  static async delete(photoId) {
    const result = await pool.query('DELETE FROM photos WHERE id = $1 RETURNING *', [photoId]);
    return result.rows[0];
  }
  static async countByUser(userId) {
    const result = await pool.query('SELECT COUNT(*) FROM photos WHERE user_id = $1', [userId]);
    return parseInt(result.rows[0].count, 10);
  }
  
  static async calculateStorageByUser(userId) {
    const result = await pool.query('SELECT SUM(size) FROM photos WHERE user_id = $1', [userId]);
    return result.rows[0].sum || 0;
  }
  
}

module.exports = Photo;
