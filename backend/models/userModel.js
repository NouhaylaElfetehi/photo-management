const db = require('../utils/dbClient');

class User {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];  
  }

  static async create({ email, password, name }) {
    const result = await db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name]
    );
    return result.rows[0]; 
  }

  static async updateRefreshToken(userId, refreshToken) {
    await db.query(
      'UPDATE users SET refresh_token = $1 WHERE id = $2',
      [refreshToken, userId]
    );
  }
}

module.exports = User;
