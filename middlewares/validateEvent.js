const Joi = require('joi');

/**
 * Middleware to validate event data
 */
const validateEvent = () => {
  return (req, res, next) => {
    const eventSchema = Joi.object().keys({
      name: Joi.string().required(),
      date: Joi.date().iso().required(),
      location: Joi.string().required(),
      description: Joi.string().optional(),
      organizerId: Joi.number().integer().required(),
    });

    const { error } = eventSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }
    
    next();
  };
};

module.exports = {
  validateEvent
}; 