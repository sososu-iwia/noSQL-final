import flightsModel from "../models/flight.model.js";

export const getAllRoutes = async (req, res) => {
  try {
    const flights = await flightsModel.find();
    if (!flights.length) {
      return res.status(404).json({
        success: false,
        message: "Flights aren't available",
      });
    }
    return res.status(200).json({
      success: true,
      data: flights,
    });
  } catch (err) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getFlightByRoute = async (req, res) => {
  const { from, to } = req.body;

  try {
    const flights = await flightsModel.find({ from, to });

    if (!flights.length) {
      return res.status(404).json({
        success: false,
        message: "Flights aren't available",
      });
    }

    return res.status(200).json({
      success: true,
      data: flights,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
