const Joi = require('joi');

const eventSchema = Joi.object().keys({
  name: Joi.string().required(),
  date: Joi.date().iso().required(),
  location: Joi.string().required(),
  description: Joi.string().optional(),
  organizerId: Joi.number().integer().required(),
});

module.exports = eventSchema;