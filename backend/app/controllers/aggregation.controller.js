import userModel from "../models/user.model.js";
import flightsModel from "../models/flight.model.js";

/**
 * GET /api/analytics/flights/top-routes?limit=10
 * Business meaning: топ направлений (from->to) по количеству рейсов.
 */
export const topFlightRoutes = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 10), 50);

    const data = await flightsModel.aggregate([
      {
        $group: {
          _id: { from: "$from", to: "$to" },
          flightsCount: { $sum: 1 },
          avgEconomy: { $avg: "$EconomPrice" },
          avgBusiness: { $avg: "$businessPrice" },
          minEconomy: { $min: "$EconomPrice" },
          maxEconomy: { $max: "$EconomPrice" },
        },
      },
      { $sort: { flightsCount: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          from: "$_id.from",
          to: "$_id.to",
          flightsCount: 1,
          avgEconomy: { $round: ["$avgEconomy", 2] },
          avgBusiness: { $round: ["$avgBusiness", 2] },
          minEconomy: 1,
          maxEconomy: 1,
        },
      },
    ]);

    return res.json({ success: true, limit, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/analytics/flights/airlines/pricing?minFlights=3
 * Business meaning: аналитика по авиакомпаниям (operatedBy):
 * - сколько рейсов
 * - средняя цена economy/business
 * - "экономность": avgBusiness - avgEconomy
 */
export const airlinesPricingStats = async (req, res) => {
  try {
    const minFlights = Math.max(Number(req.query.minFlights || 1), 1);

    const data = await flightsModel.aggregate([
      {
        $group: {
          _id: "$operatedBy",
          flightsCount: { $sum: 1 },
          avgEconomy: { $avg: "$EconomPrice" },
          avgBusiness: { $avg: "$businessPrice" },
          minEconomy: { $min: "$EconomPrice" },
          maxEconomy: { $max: "$EconomPrice" },
          minBusiness: { $min: "$businessPrice" },
          maxBusiness: { $max: "$businessPrice" },
        },
      },
      { $match: { flightsCount: { $gte: minFlights } } },
      {
        $addFields: {
          premiumGap: { $subtract: ["$avgBusiness", "$avgEconomy"] }, // business - economy
        },
      },
      { $sort: { flightsCount: -1, avgEconomy: 1 } },
      {
        $project: {
          _id: 0,
          operatedBy: "$_id",
          flightsCount: 1,
          avgEconomy: { $round: ["$avgEconomy", 2] },
          avgBusiness: { $round: ["$avgBusiness", 2] },
          premiumGap: { $round: ["$premiumGap", 2] },
          minEconomy: 1,
          maxEconomy: 1,
          minBusiness: 1,
          maxBusiness: 1,
        },
      },
    ]);

    return res.json({ success: true, minFlights, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
