const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  title: String,
  description: String,
  estimatedCost: Number,
  timeOfDay: String,
});

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    budgetTier: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    interests: [String],

    travelMonth: {
      type: String,
    },

    itinerary: [
      {
        dayNumber: Number,
        activities: [ActivitySchema],
      },
    ],

    hotels: [
      {
        name: String,
        tier: String,
        estimatedCostPerNight: Number,
        rating: String,
      },
    ],

    estimatedBudget: {
      transport: Number,
      accommodation: Number,
      food: Number,
      activities: Number,
      total: Number,
    },

    packingList: [
      {
        item: String,
        category: String,
        isPacked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Trip", TripSchema);
