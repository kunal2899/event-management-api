const { registerUserSchema, loginUserSchema } = require('../schemas/userSchemas');

/**
 * Middleware to validate user registration data
 */
const validateRegisterUser = () => {
  return (req, res, next) => {
    const { error } = registerUserSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }
    
    next();
  };
};

/**
 * Middleware to validate user login data
 */
const validateLoginUser = () => {
  return (req, res, next) => {
    const { error } = loginUserSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }
    
    next();
  };
};

module.exports = {
  validateRegisterUser,
  validateLoginUser
}; 