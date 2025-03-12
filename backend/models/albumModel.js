// backend/models/albumModel.js
const pool = require('../utils/dbClient');

class Album {
  static async create({ userId, name, description }) {
    const result = await pool.query(
      'INSERT INTO albums (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, description]
    );
    return result.rows[0];
  }

  static async findAllByUser(userId) {
    const result = await pool.query('SELECT * FROM albums WHERE user_id = $1', [userId]);
    return result.rows;
  }

  static async delete(albumId) {
    const result = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING *', [albumId]);
    return result.rows[0];
  }

  static async addPhoto(albumId, photoId) {
    await pool.query(
      'INSERT INTO album_photos (album_id, photo_id) VALUES ($1, $2)',
      [albumId, photoId]
    );
  }
  static async countByUser(userId) {
    const result = await pool.query('SELECT COUNT(*) FROM albums WHERE user_id = $1', [userId]);
    return parseInt(result.rows[0].count, 10);
  }
  
  static async removePhoto(albumId, photoId) {
    await pool.query(
      'DELETE FROM album_photos WHERE album_id = $1 AND photo_id = $2',
      [albumId, photoId]
    );
  }
}

module.exports = Album;
