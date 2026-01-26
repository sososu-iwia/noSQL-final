import { Router } from "express";
import userAuth from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { paySchema } from "../validations/payment.validation.js";
import { payBooking } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/pay", userAuth, validateMiddleware(paySchema), payBooking);

export default paymentRouter;
