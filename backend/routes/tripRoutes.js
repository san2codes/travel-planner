const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
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
} = require("../controllers/tripController");

router.post("/create", authMiddleware, createTrip);

router.get("/", authMiddleware, getMyTrips);

router.get("/:id", authMiddleware, getSingleTrip);

router.delete("/:id", authMiddleware, deleteTrip);

router.put("/:id", authMiddleware, updateTrip);

router.post("/generate", authMiddleware, generateTrip);

router.put("/:id/regenerate-day", authMiddleware, regenerateDay);

router.put("/:id/packing/:itemId", authMiddleware, togglePackingItem);

router.post("/:id/day/:dayNumber/activity", authMiddleware, addActivity);

router.delete(
  "/:id/day/:dayNumber/activity/:activityId",
  authMiddleware,
  deleteActivity,
);

router.put(
  "/:id/day/:dayNumber/activity/:activityId",
  authMiddleware,
  editActivity,
);

module.exports = router;
