// backend/models/photoModel.js
const pool = require('../utils/dbClient');
const { v4: uuidv4 } = require('uuid');


class Photo {
  static async create({ id, userId, fileName, size, uploadedAt }) {
    const result = await pool.query(
      'INSERT INTO photos (id, user_id, file_name, size, uploaded_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [uuidv4(), userId,size, fileName, uploadedAt]
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
  static async findDeletedByUser(userId) {
    const result = await pool.query(
      "SELECT * FROM photos WHERE user_id = $1 AND deleted_at IS NOT NULL",
      [userId]
    );
    return result.rows;
  }
  
  static async delete(photoId) {
    const result = await pool.query(
      "UPDATE photos SET deleted_at = NOW() WHERE id = $1 RETURNING *",
      [photoId]
    );
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
