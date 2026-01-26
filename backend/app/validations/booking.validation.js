// validators/booking.schema.js
import Joi from "joi";

export const createBookingSchema = Joi.object({
  flightId: Joi.string().required(),
  cabinClass: Joi.string().valid("economy", "business").required(),
  passengers: Joi.array()
    .min(1)
    .items(
      Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        gender: Joi.string().valid("male", "female").required(),
      }),
    )
    .required(),
}).options({ allowUnknown: false });
