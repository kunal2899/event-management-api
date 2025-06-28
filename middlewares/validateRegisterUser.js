import { registerUserSchema } from "../schemas/userSchemas";

export const validateRegisterUser = (req, res, next) => {
  try {
    const user = req.body;
    const { error: validationError } = registerUserSchema.validate(user);
    if (validationError) {
      throw new Error(
        `Invalid payload provided${
          validationError.message ? `: ${validationError.message}` : "!"
        }`
      );
    }
    next();
  } catch (error) {
    console.error("Error in middlewares.validateRegisterUser --- ", error);
    return res.status(400).send({ message: "Something went wrong!" });
  }
}