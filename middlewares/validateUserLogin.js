import { loginUserSchema } from "../schemas/userSchemas";

export const validateUserLogin = (req, res, next) => {
  try {
    const user = req.body;
    const { error: validationError } = loginUserSchema.validate(user);
    if (validationError) {
      throw new Error(
        `Invalid payload provided${
          validationError.message ? `: ${validationError.message}` : "!"
        }`
      );
    }
    next();
  } catch (error) {
    console.error("Error in middlewares.validateUserLogin --- ", error);
    return res.status(400).send({ message: "Something went wrong!" });
  }
}