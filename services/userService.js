const pool = require('../configs/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Find a user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User object or null if not found
 */
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows.length ? rows[0] : null;
};

/**
 * Find a user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} - User object or null if not found
 */
const findUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows.length ? rows[0] : null;
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user object
 */
const createUser = async (userData) => {
  const { name, email, password, address } = userData;
  
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const query = `
    INSERT INTO users (name, email, password, address)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, address, created_at
  `;
  
  const { rows } = await pool.query(query, [name, email, hashedPassword, address]);
  return rows[0];
};

/**
 * Authenticate a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} - JWT token or null if authentication fails
 */
const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    return null;
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  authenticateUser
}; 