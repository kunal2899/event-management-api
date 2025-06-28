const Joi = require("joi");

const userSchema = Joi.object().keys({
  name: Joi.string(),
  address: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().pattern(
    new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
  ),
});

const registerUserSchema = userSchema
  .extract(["name", "address", "email", "password"])
  .required();

const loginUserSchema = userSchema
  .extract(["email", "password"])
  .required();

export {
  registerUserSchema,
  loginUserSchema,
};
