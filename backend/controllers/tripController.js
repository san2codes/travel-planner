const Trip = require("../models/Trip");
const {
  generateTripPlan,
  regenerateDayPlan,
} = require("../services/geminiService");

const createTrip = async (req, res) => {
  try {
    const { destination, durationDays, budgetTier, interests, travelMonth } =
      req.body;

    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      durationDays,
      budgetTier,
      interests,
      travelMonth,
      itinerary: [],
      hotels: [],
      packingList: [],
      estimatedBudget: {},
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getSingleTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
      },
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const generateTrip = async (req, res) => {
  try {
    const { destination, durationDays, budgetTier, interests, travelMonth } =
      req.body;

    const aiData = await generateTripPlan(
      destination,
      durationDays,
      budgetTier,
      interests,
      travelMonth,
    );

    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      durationDays,
      budgetTier,
      interests,
      travelMonth,

      itinerary: aiData.itinerary,
      hotels: aiData.hotels,
      estimatedBudget: aiData.estimatedBudget,
      packingList: aiData.packingList,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Generation Failed",
    });
  }
};

const regenerateDay = async (req, res) => {
  try {
    const { dayNumber, userRequest } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const currentDay = trip.itinerary.find(
      (day) => day.dayNumber === dayNumber,
    );

    if (!currentDay) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    const updatedDay = await regenerateDayPlan(
      trip.destination,
      dayNumber,
      currentDay.activities,
      userRequest,
    );

    const dayIndex = trip.itinerary.findIndex(
      (day) => day.dayNumber === dayNumber,
    );

    trip.itinerary[dayIndex] = updatedDay;

    await trip.save();

    res.json(trip);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to regenerate day",
    });
  }
};

const togglePackingItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const item = trip.packingList.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Packing item not found",
      });
    }

    item.isPacked = !item.isPacked;

    await trip.save();

    res.json(trip);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update packing item",
    });
  }
};

const addActivity = async (req, res) => {
  try {
    const { dayNumber } = req.params;

    const { title, description, estimatedCost, timeOfDay } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const day = trip.itinerary.find(
      (item) => item.dayNumber === Number(dayNumber),
    );

    if (!day) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    day.activities.push({
      title,
      description,
      estimatedCost,
      timeOfDay,
    });

    await trip.save();

    res.json(trip);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add activity",
    });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { dayNumber, activityId } = req.params;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const day = trip.itinerary.find(
      (item) => item.dayNumber === Number(dayNumber),
    );

    if (!day) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    day.activities = day.activities.filter(
      (activity) => activity._id.toString() !== activityId,
    );

    await trip.save();

    res.json(trip);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete activity",
    });
  }
};

const editActivity = async (req, res) => {
  try {
    const { dayNumber, activityId } = req.params;

    const { title, description, estimatedCost, timeOfDay } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const day = trip.itinerary.find(
      (item) => item.dayNumber === Number(dayNumber),
    );

    if (!day) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    const activity = day.activities.id(activityId);

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    activity.title = title;
    activity.description = description;
    activity.estimatedCost = estimatedCost;
    activity.timeOfDay = timeOfDay;

    await trip.save();

    res.json(trip);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update activity",
    });
  }
};

module.exports = {
  createTrip,
  getMyTrips,
  getSingleTrip,
  deleteTrip,
  updateTrip,
  generateTrip,
  regenerateDay,
  togglePackingItem,
  addActivity,
  deleteActivity,
  editActivity,
};
