import { Router } from "express";
import {
  topFlightRoutes,
  airlinesPricingStats,
} from "../controllers/aggregation.controller.js";

const AggregationRouter = Router();

// Flights analytics
AggregationRouter.get("/flights/top-routes", topFlightRoutes);
AggregationRouter.get("/flights/airlines/pricing", airlinesPricingStats);

export default AggregationRouter;
