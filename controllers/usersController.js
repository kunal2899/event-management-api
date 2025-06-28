const userService = require('../services/userService');
const eventService = require('../services/eventService');
const emailService = require('../services/emailService');

/**
 * Register a new user
 */
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const { email } = userData;
    
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    // Create user
    const newUser = await userService.createUser(userData);
    
    // Send welcome email
    await emailService.sendRegistrationEmail(newUser).catch(err => {
      console.error('Error sending registration email:', err);
      // Continue despite email error
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Error in usersController.registerUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Log in a user
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const authResult = await userService.authenticateUser(email, password);
    
    if (!authResult) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({
      message: 'Login successful',
      ...authResult
    });
  } catch (error) {
    console.error('Error in usersController.loginUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get current user's profile
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove sensitive information
    delete user.password;
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in usersController.getUserProfile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get events the user is registered for
 */
const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await eventService.getUserEvents(userId);
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error in usersController.getUserEvents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserEvents
}; 