import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  from: { type: String, required: true },
  fromAirport: { type: String, required: true },
  to: { type: String, required: true },
  toAirport: { type: String, required: true },
  operatedBy: { type: String, required: true },
  flightNumber: { type: String, required: true },
  airplaneType: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  flightDuration: { type: String, required: true },
  numberOfTransfers: { type: String, required: true },
  EconomPrice: { type: Number, required: true },
  businessPrice: { type: Number, required: true },
  createdAt: { type: Date },
});

const flightsModel =
  mongoose.models.flight || mongoose.model("flight", flightSchema);

export default flightsModel;
