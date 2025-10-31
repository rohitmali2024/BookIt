import express from "express";
import Booking from "../models/Booking.js";
import Experience from "../models/Experience.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      experienceId,
      fullName,
      email,
      date,
      time,
      guests,
      totalPrice,
      promoCode,
      discount,
    } = req.body;

    // Validate required fields
    if (!experienceId || !fullName || !email || !date || !time || !guests || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const slot = experience.slots.find(
      (s) =>
        new Date(s.date).toDateString() === new Date(date).toDateString() &&
        s.time === time
    );

    if (!slot) {
      return res.status(400).json({ message: "Slot not found" });
    }

    if (slot.booked + guests > slot.available) {
      return res.status(400).json({ message: "Not enough slots available" });
    }

    // Create booking
    const booking = new Booking({
      userId: req.userId,
      experienceId,
      fullName,
      email,
      date,
      time,
      guests,
      totalPrice,
      promoCode,
      discount,
    });

    await booking.save();

    // Update slot availability
    slot.booked += guests;
    await experience.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

// Get user bookings
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate("experienceId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
});

export default router;
