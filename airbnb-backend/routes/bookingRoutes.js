const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { validateBooking } = require("../middleware/validation");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getHostBookings
} = require("../controllers/bookingController");

// Create booking (logged-in users)
router.post("/", protect, validateBooking, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getUserBookings);

// Get host's bookings
router.get("/host", protect, getHostBookings);

// Cancel a booking
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;