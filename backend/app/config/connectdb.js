import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error:", err);
  });

  await mongoose.connect(`${process.env.MONGO_PUBLIC_URI}`);
  console.log("MongoDB connected successfully");
};

export default connectDB;
