const express = require('express');
const { validateEvent } = require('../middlewares/validateEvent');
const { authenticate } = require('../middlewares/auth');
const { 
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventParticipants
} = require('../controllers/eventsController');

const router = express.Router();

router.use(express.json());

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes - require authentication
router.post('/', authenticate, validateEvent(), createEvent);
router.put('/:id', authenticate, validateEvent(), updateEvent);
router.delete('/:id', authenticate, deleteEvent);
router.post('/:id/register', authenticate, registerForEvent);
router.get('/:id/participants', authenticate, getEventParticipants);

module.exports = router;
