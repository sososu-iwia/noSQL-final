import express from "express";
import {  getAllRoutes, getFlightByRoute } from "../controllers/flight.controller.js";

const flightRoutes = express.Router();

flightRoutes.post("/getFlightByRoute", getFlightByRoute);
flightRoutes.post("/getAllRoutes", getAllRoutes)

export default flightRoutes
