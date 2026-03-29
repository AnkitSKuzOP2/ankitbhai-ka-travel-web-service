import express from "express";
import {
  createBooking,
  getAllBooking,
  getBooking,
  createBookingPublic,
  getBookingsByUser,
} from "../controllers/bookingController.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.post("/public", verifyToken, createBookingPublic);

// Get all bookings for a specific user (by userId param)
router.get("/user/:userId", verifyToken, getBookingsByUser);

router.get("/:id", verifyUser, getBooking);
router.get("/", verifyAdmin, getAllBooking);

export default router;
