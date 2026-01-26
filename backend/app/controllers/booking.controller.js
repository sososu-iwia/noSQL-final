import bookingModel from "../models/booking.model.js";
import flightsModel from "../models/flight.model.js";
import userModel from "../models/user.model.js";

const generatePNR = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase(); 

export const createBooking = async (req, res) => {
  const userId = req.user.id;
  const { flightId, cabinClass, passengers } = req.body;

  try {
    const flight = await flightsModel.findById(flightId);
    if (!flight) {
      return res.status(404).json({ success: false, message: "Flight not found" });
    }

    const user = await userModel.findById(userId).select("email");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const pricePerPassenger =
      cabinClass === "business" ? flight.businessPrice : flight.EconomPrice;

    const totalPrice = pricePerPassenger * passengers.length;

    
    const pnr = generatePNR();

    const booking = await bookingModel.create({
      user: userId,
      flight: flightId,
      passengers,
      cabinClass,
      pricePerPassenger,
      totalPrice,
      status: "pending",
      pnr,
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created",
      booking,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const myBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ user: req.user.id })
      .populate("flight")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingModel
      .findOne({ _id: req.params.id, user: req.user.id })
      .populate("flight")
      .populate("payment");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "confirmed") {
      return res
        .status(400)
        .json({ success: false, message: "Confirmed bookings cannot be cancelled here" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
