const eventService = require('../services/eventService');
const userService = require('../services/userService');
const emailService = require('../services/emailService');

/**
 * Create a new event
 */
const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Set organizer ID from authenticated user
    eventData.organizerId = req.user.id;
    
    const newEvent = await eventService.createEvent(eventData);
    
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Error in eventsController.createEvent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all events
 */
const getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error in eventsController.getAllEvents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get event by ID
 */
const getEventById = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    
    const event = await eventService.getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error in eventsController.getEventById:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update an event
 */
const updateEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventData = req.body;
    const userId = req.user.id;
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    
    // Get current event to check ownership
    const currentEvent = await eventService.getEventById(eventId);
    
    if (!currentEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (currentEvent.organizerId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }
    
    const updatedEvent = await eventService.updateEvent(eventId, eventData);
    
    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error in eventsController.updateEvent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete an event
 */
const deleteEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    
    // Get current event to check ownership
    const currentEvent = await eventService.getEventById(eventId);
    
    if (!currentEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (currentEvent.organizerId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }
    
    const deleted = await eventService.deleteEvent(eventId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error in eventsController.deleteEvent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Register current user for an event
 */
const registerForEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    
    // Check if event exists
    const event = await eventService.getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Register for event
    try {
      const registration = await eventService.registerForEvent(eventId, userId);
      
      // Get user details for email
      const user = await userService.findUserById(userId);
      
      // Send confirmation email
      await emailService.sendEventRegistrationEmail(user, event).catch(err => {
        console.error('Error sending event registration email:', err);
        // Continue despite email error
      });
      
      res.status(201).json({
        message: 'Successfully registered for event',
        registration
      });
    } catch (error) {
      if (error.message === 'User already registered for this event') {
        return res.status(409).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in eventsController.registerForEvent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get participants for an event
 */
const getEventParticipants = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    
    // Get current event to check ownership
    const currentEvent = await eventService.getEventById(eventId);
    
    if (!currentEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer (only organizers can see participants)
    if (currentEvent.organizerId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view participants' });
    }
    
    const participants = await eventService.getEventParticipants(eventId);
    
    res.status(200).json(participants);
  } catch (error) {
    console.error('Error in eventsController.getEventParticipants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventParticipants
}; 