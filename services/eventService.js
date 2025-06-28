const pool = require('../configs/dbConfig');

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} - Created event object
 */
const createEvent = async (eventData) => {
  const { name, date, location, description, organizerId } = eventData;
  
  const query = `
    INSERT INTO events (name, date, location, description, organizer_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, date, location, description, organizer_id as "organizerId", created_at, updated_at
  `;
  
  const { rows } = await pool.query(query, [name, date, location, description, organizerId]);
  return rows[0];
};

/**
 * Get all events
 * @returns {Promise<Array>} - List of events
 */
const getAllEvents = async () => {
  const query = `
    SELECT e.id, e.name, e.date, e.location, e.description, 
           e.organizer_id as "organizerId", u.name as "organizerName",
           e.created_at, e.updated_at
    FROM events e
    JOIN users u ON e.organizer_id = u.id
    ORDER BY e.date
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};

/**
 * Get event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise<Object|null>} - Event object or null if not found
 */
const getEventById = async (eventId) => {
  const query = `
    SELECT e.id, e.name, e.date, e.location, e.description, 
           e.organizer_id as "organizerId", u.name as "organizerName",
           e.created_at, e.updated_at
    FROM events e
    JOIN users u ON e.organizer_id = u.id
    WHERE e.id = $1
  `;
  
  const { rows } = await pool.query(query, [eventId]);
  return rows.length ? rows[0] : null;
};

/**
 * Update an event
 * @param {number} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object|null>} - Updated event object or null if not found
 */
const updateEvent = async (eventId, eventData) => {
  const { name, date, location, description } = eventData;
  
  const query = `
    UPDATE events
    SET name = $1, date = $2, location = $3, description = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING id, name, date, location, description, organizer_id as "organizerId", created_at, updated_at
  `;
  
  const { rows } = await pool.query(query, [name, date, location, description, eventId]);
  return rows.length ? rows[0] : null;
};

/**
 * Delete an event
 * @param {number} eventId - Event ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
const deleteEvent = async (eventId) => {
  // First delete all participants
  await pool.query('DELETE FROM participants WHERE event_id = $1', [eventId]);
  
  // Then delete the event
  const { rowCount } = await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
  return rowCount > 0;
};

/**
 * Register a user for an event
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Registration details
 */
const registerForEvent = async (eventId, userId) => {
  // Check if user is already registered
  const checkQuery = 'SELECT * FROM participants WHERE event_id = $1 AND user_id = $2';
  const existingReg = await pool.query(checkQuery, [eventId, userId]);
  
  if (existingReg.rows.length) {
    throw new Error('User already registered for this event');
  }
  
  const query = `
    INSERT INTO participants (event_id, user_id)
    VALUES ($1, $2)
    RETURNING id, event_id as "eventId", user_id as "userId", created_at
  `;
  
  const { rows } = await pool.query(query, [eventId, userId]);
  return rows[0];
};

/**
 * Get all participants for an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Array>} - List of participants
 */
const getEventParticipants = async (eventId) => {
  const query = `
    SELECT p.id, p.event_id as "eventId", p.user_id as "userId", 
           u.name, u.email, p.created_at
    FROM participants p
    JOIN users u ON p.user_id = u.id
    WHERE p.event_id = $1
  `;
  
  const { rows } = await pool.query(query, [eventId]);
  return rows;
};

/**
 * Get all events for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of events
 */
const getUserEvents = async (userId) => {
  const query = `
    SELECT e.id, e.name, e.date, e.location, e.description, 
           e.organizer_id as "organizerId", u.name as "organizerName",
           p.created_at as "registrationDate"
    FROM events e
    JOIN participants p ON e.id = p.event_id
    JOIN users u ON e.organizer_id = u.id
    WHERE p.user_id = $1
    ORDER BY e.date
  `;
  
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventParticipants,
  getUserEvents
}; 