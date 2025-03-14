const db = require('../utils/dbClient');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];  
  }
  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];  // Retourne l'utilisateur si trouvé
  }
  
  static async create({ email, password, name }) {
    const result = await db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name]
    );
    return result.rows[0]; 
  }
   // New method for updating user profile
 
   static async updateProfile(userId, { name, email, phone, password, avatar }) {
    const result = await db.query(
      `UPDATE users 
       SET name = $1, 
           email = $2, 
           phone = $3, 
           password = CASE WHEN $4 IS NOT NULL THEN CAST($4 AS TEXT) ELSE password END, 
           avatar = CASE WHEN $5 IS NOT NULL THEN CAST($5 AS TEXT) ELSE avatar END
       WHERE id = $6
       RETURNING *`,
      [name, email, phone, password || null, avatar || null, userId] // ✅ Evite undefined
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
