import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(12).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-])[A-Za-z\d@$!%*?&#^()_+=\-]+$/,
    )
    .required()
    .trim(),
  firstName: Joi.string()
    .pattern(/^[A-Za-zА-Яа-я]+$/)
    .required()
    .trim(),

  lastName: Joi.string()
    .pattern(/^[A-Za-zА-Яа-я]+$/)
    .required()
    .trim(),

  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required(),
}).options({allowUnknown: false});

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(12),
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-])[A-Za-z\d@$!%*?&#^()_+=\-]+$/,
    )
    .required()
    .trim(),
}).xor("username", "email");

export const otpSchema = Joi.object({
  otp: Joi.string().length(6).pattern(/^\d+$/).required(),
});
