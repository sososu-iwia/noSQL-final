import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./app/config/connectdb.js";
import authRouter from "./app/routes/auth.routes.js";
import userRouter from "./app/routes/user.routes.js";
import flightRouter from "./app/routes/flight.routes.js";
import bookingRouter from "./app/routes/booking.routes.js";
import paymentRouter from "./app/routes/payment.routes.js";
import AggregationRouter from "./app/routes/aggregation.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON" });
  }
  next(err);
});

app.get("/", (req, res) => res.send("main page"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/flights", flightRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/analytics", AggregationRouter)

app.listen(PORT, () => console.log(`Server running at ${PORT}`));
