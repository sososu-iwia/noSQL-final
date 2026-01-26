// validators/payment.schema.js
import Joi from "joi";

export const paySchema = Joi.object({
  bookingId: Joi.string().required(),

  cardNumber: Joi.string().pattern(/^\d{13,19}$/).required(),
  expMonth: Joi.number().integer().min(1).max(12).required(),
  expYear: Joi.number().integer().min(2025).max(2100).required(),
  cvv: Joi.string().pattern(/^\d{3,4}$/).required(),
}).options({ allowUnknown: false });
