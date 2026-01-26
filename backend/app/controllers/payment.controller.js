import bookingModel from "../models/booking.model.js";
import paymentModel from "../models/payment.model.js";
import flightsModel from "../models/flight.model.js";
import transporter from "../config/nodemailer.js";
import { isValidLuhn, isCardNotExpired } from "../utils/cardValidation.js";

const buildTicketText = ({ booking, flight }) => {
  return (
    `✅ E-Ticket / Booking Confirmed\n\n` +
    `PNR: ${booking.pnr}\n\n` +
    `Flight details:\n` +
    `Route: ${flight.fromAirport} → ${flight.toAirport}\n` +
    `Flight: ${flight.operatedBy} ${flight.flightNumber}\n` +
    `Aircraft: ${flight.airplaneType}\n` +
    `Departure: ${flight.departureTime}\n` +
    `Arrival: ${flight.arrivalTime}\n` +
    `Duration: ${flight.flightDuration}\n` +
    `Transfers: ${flight.numberOfTransfers}\n\n` +
    `Cabin: ${booking.cabinClass}\n` +
    `Passengers: ${booking.passengers.map(p => `${p.firstName} ${p.lastName}`).join(", ")}\n\n` +
    `Total paid: ${booking.totalPrice} KZT\n\n` +
    `Seat selection is available at the airport during check-in.\n` +
    `Thank you for choosing Vizier Airways!`
  );
};

export const payBooking = async (req, res) => {
  const userId = req.user.id;
  const { bookingId, cardNumber, expMonth, expYear } = req.body;

  try {
    if (!isValidLuhn(cardNumber)) {
      return res.status(400).json({ success: false, message: "Invalid card number" });
    }
    if (!isCardNotExpired(expMonth, expYear)) {
      return res.status(400).json({ success: false, message: "Card expired" });
    }

    const booking = await bookingModel.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({ success: false, message: "Booking already confirmed" });
    }

    const payment = await paymentModel.create({
      booking: booking._id,
      user: userId,
      amount: booking.totalPrice,
      currency: "KZT",
      cardLast4: cardNumber.slice(-4),
      expMonth,
      expYear,
      status: true,
    });

    booking.status = "confirmed";
    booking.payment = payment._id;
    await booking.save();

    const flight = await flightsModel.findById(booking.flight);
    if (flight) {
      const text = buildTicketText({ booking, flight });

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: booking.email,
        subject: `Your E-Ticket (PNR: ${booking.pnr})`,
        text,
      });
    }

    return res.json({
      success: true,
      message: "Payment successful. Ticket sent to email.",
      bookingId: booking._id,
      paymentId: payment._id,
      pnr: booking.pnr,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ success: false, message: "Payment already exists for this booking" });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};
