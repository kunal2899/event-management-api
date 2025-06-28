const express = require('express');
const { validateRegisterUser, validateLoginUser } = require('../middlewares/validateUser');
const { authenticate } = require('../middlewares/auth');
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  getUserEvents
} = require('../controllers/usersController');

const router = express.Router();

router.use(express.json());

// Public routes
router.post('/register', validateRegisterUser(), registerUser);
router.post('/login', validateLoginUser(), loginUser);

// Protected routes
router.get('/me', authenticate, getUserProfile);
router.get('/me/events', authenticate, getUserEvents);

module.exports = router;