const db = require('../config/database');
const pool = db.pool;

class Team {
  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM teams WHERE team_id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async findByName(name, userId) {
    const result = await pool.query(
      'SELECT * FROM teams WHERE name = $1 AND user_id = $2',
      [name, userId]
    );
    return result.rows[0];
  }

  static async create(data, userId) {
    const { name, color } = data;
    // Valider le format de la couleur (code hexadécimal)
    const validColor = color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) 
      ? color 
      : null;
      
    const result = await pool.query(
      'INSERT INTO teams (name, color, user_id) VALUES ($1, $2, $3) RETURNING *',
      [name, validColor, userId]
    );
    return result.rows[0];
  }

  static async update(id, data, userId) {

    console.log('data :', data);
    const { name, color } = data;
    console.log('color :', color);
    // Valider le format de la couleur (code hexadécimal)
    const validColor = color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) 
      ? color 
      : null;
      
    const result = await pool.query(
      'UPDATE teams SET name = $1, color = $2 WHERE team_id = $3 AND user_id = $4 RETURNING *',
      [name, validColor, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM teams WHERE team_id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  }

  static async findAll(userId) {
    const result = await pool.query(
      'SELECT * FROM teams WHERE user_id = $1 ORDER BY name',
      [userId]
    );
    return result.rows;
  }
}

module.exports = { Team };