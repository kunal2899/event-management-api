const pick = require('lodash/pick');
const isEmpty = require('lodash/isEmpty');
const pool = require('../configs/dbConfig');

const createUser = async userData => {
  try {
    const { name, address, email, password } = userData;
    const query = `
      INSERT INTO users (name, address, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows: [createdUser] } = await pool.query(query, [name, address, email, password]);
    return createdUser;
  } catch (error) {
    console.error('Error in usersService.createUser --- ', error);
    throw new Error('Failed to create user');
  }
}

const getAllUsers = async () => {
  try {
    const { rows: users } = await pool.query('SELECT * FROM users');
    return users;
  } catch (error) {
    console.error('Error in usersService.getAllUsers --- ', error);
    throw new Error('Failed to get all users');
  }
}

const getUserByEmail = async email => {
  try {
    const query = `
      SELECT * FROM users WHERE email = $1
    `;
    const { rows: [user] } = await pool.query(query, [email]);
    return user;
  } catch (error) {
    console.error('Error in usersService.getUserByEmail --- ', error);
    throw new Error('Failed to get user by email');
  }
}

const updateUser = async (userId, userData) => {
  try {
    if (!isEmpty(userData)) {
      throw new Error('No data to update');
    }
    const fieldsToUpdate = pick(userData, ['name', 'address', 'email']);
    const params = [];
    const setString = 'SET ';
    Object.keys(fieldsToUpdate).forEach((key, index) => {
      params.push(fieldsToUpdate[key]);
      setString += `${key} = $${index + 1}${
        index < Object.keys(fieldsToUpdate).length - 1 ? ", " : ""
      }`;
    });
    const query = `
      UPDATE users
      ${setString}
      WHERE id = $${params.push(userId)}
      RETURNING *
    `;
    const { rows: [updatedUser] } = await pool.query(query, params);
    return updatedUser;
  } catch (error) {
    console.error('Error in usersService.updateUser --- ', error);
    throw new Error('Failed to update user');
  }
}

const deleteUser = async userId => {
  try {
    const query = `
      DELETE FROM users WHERE id = $1
      RETURNING *
    `;
    const { rows: [userToBeDeleted] } = await pool.query(query, [userId]);
    if (!userToBeDeleted) {
      throw new Error('User does not exists!');
    }
  } catch (error) {
    console.error('Error in usersService.deleteUser --- ', error);
    throw new Error('Failed to delete user');
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
}
