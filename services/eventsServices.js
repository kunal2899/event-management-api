const pick = require('lodash/pick');
const isEmpty = require('lodash/isEmpty');
const pool = require('../configs/dbConfig');

const createEvent = async eventData => {
  try {
    const { name, date, location, organizerId, description } = eventData;
    const query = `
      INSERT INTO events (name, date, location, organizer_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows: [createdEvent] } = await pool.query(query, [name, date, location, organizerId, description]);
    return createdEvent;
  } catch (error) {
    console.error('Error in eventsService.createEvent --- ', error);
    throw new Error('Failed to create event');
  }
}

const getAllEvents = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM events';
    const params = [];
    const { organizerId, fromDate, toDate } = filters;
    
    const conditions = [];
    if (organizerId) {
      conditions.push(`organizer_id = $${params.push(organizerId)}`);
    }
    if (fromDate) {
      params.push(fromDate);
      conditions.push(`date >= $${params.push(fromDate)}`);
    }
    if (toDate) {
      params.push(toDate);
      conditions.push(`date <= $${params.length}`);
    }
    
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY date ASC';

    const { rows: events } = await pool.query(query, params);
    return events;
  } catch (error) {
    console.error('Error in eventsService.getAllEvents --- ', error);
    throw new Error('Failed to get events');
  }
}

const getEventById = async eventId => {
  try {
    const query = `
      SELECT 
        e.*,
        json_agg(json_build_object('id', u.id, 'name', u.name, 'email', u.email)) as participants
      FROM events e
      LEFT JOIN participants p ON e.id = p.event_id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    const { rows: [event] } = await pool.query(query, [eventId]);
    return event;
  } catch (error) {
    console.error('Error in eventsService.getEventById --- ', error);
    throw new Error('Failed to get event');
  }
}

const updateEvent = async (eventId, eventData) => {
  try {
    if (isEmpty(eventData)) {
      throw new Error('No data to update');
    }
    const fieldsToUpdate = pick(eventData, ['name', 'date', 'location', 'description']);
    const params = [];
    let setString = 'SET ';
    Object.keys(fieldsToUpdate).forEach((key, index) => {
      params.push(fieldsToUpdate[key]);
      setString += `${key === 'organizerId' ? 'organizer_id' : key} = $${index + 1}${
        index < Object.keys(fieldsToUpdate).length - 1 ? ", " : ""
      }`;
    });
    params.push(eventId);

    const query = `
      UPDATE events
      ${setString}
      WHERE id = $${params.length}
      RETURNING *
    `;
    const { rows: [updatedEvent] } = await pool.query(query, params);
    if (!updatedEvent) {
      throw new Error('Event not found');
    }
    return updatedEvent;
  } catch (error) {
    console.error('Error in eventsService.updateEvent --- ', error);
    throw new Error('Failed to update event');
  }
}

const deleteEvent = async eventId => {
  try {
    // First delete all participants
    await pool.query('DELETE FROM participants WHERE event_id = $1', [eventId]);
    
    // Then delete the event
    const query = `
      DELETE FROM events 
      WHERE id = $1
      RETURNING *
    `;
    const { rows: [deletedEvent] } = await pool.query(query, [eventId]);
    if (!deletedEvent) {
      throw new Error('Event not found');
    }
    return deletedEvent;
  } catch (error) {
    console.error('Error in eventsService.deleteEvent --- ', error);
    throw new Error('Failed to delete event');
  }
}

const addParticipant = async (eventId, userId) => {
  try {
    const query = `
      INSERT INTO participants (event_id, user_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows: [participant] } = await pool.query(query, [eventId, userId]);
    return participant;
  } catch (error) {
    console.error('Error in eventsService.addParticipant --- ', error);
    throw new Error('Failed to add participant');
  }
}

const removeParticipant = async (eventId, userId) => {
  try {
    const query = `
      DELETE FROM participants 
      WHERE event_id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows: [participant] } = await pool.query(query, [eventId, userId]);
    if (!participant) {
      throw new Error('Participant not found');
    }
    return participant;
  } catch (error) {
    console.error('Error in eventsService.removeParticipant --- ', error);
    throw new Error('Failed to remove participant');
  }
}

const getEventParticipants = async eventId => {
  try {
    const query = `
      SELECT u.id, u.name, u.email
      FROM participants p
      JOIN users u ON p.user_id = u.id
      WHERE p.event_id = $1
    `;
    const { rows: participants } = await pool.query(query, [eventId]);
    return participants;
  } catch (error) {
    console.error('Error in eventsService.getEventParticipants --- ', error);
    throw new Error('Failed to get event participants');
  }
}

module.exports = {
  createEvent,
  getAllEvents, 
  getEventById,
  updateEvent,
  deleteEvent,
  addParticipant,
  removeParticipant,
  getEventParticipants
};