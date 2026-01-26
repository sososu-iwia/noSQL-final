import { Router } from "express";
import userAuth from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { createBookingSchema } from "../validations/booking.validation.js";
import { createBooking, myBookings, getBookingById, cancelBooking } from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.post("/", userAuth, validateMiddleware(createBookingSchema), createBooking);
bookingRouter.get("/me", userAuth, myBookings);
bookingRouter.get("/:id", userAuth, getBookingById);
bookingRouter.patch("/:id/cancel", userAuth, cancelBooking);

export default bookingRouter;
