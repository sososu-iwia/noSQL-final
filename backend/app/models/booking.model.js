import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: "flight", required: true },

    passengers: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, enum: ["male", "female"], required: true },
      },
    ],

    cabinClass: { type: String, enum: ["economy", "business"], required: true },

    pricePerPassenger: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

    payment: { type: mongoose.Schema.Types.ObjectId, ref: "payment", default: null },

    pnr: { type: String, unique: true, required: true },

    email: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.booking || mongoose.model("booking", bookingSchema);
