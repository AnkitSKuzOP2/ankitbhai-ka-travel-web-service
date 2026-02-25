import express from "express";
import {
  createBooking,
  getAllBooking,
  getBooking,
  createBookingPublic,
} from "../Controllers/bookingController.js";
import { verifyToken } from "../utils/verifyToken.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyUser, createBooking);
router.post("/public", verifyToken, createBookingPublic);
router.get("/:id", verifyUser, getBooking);
router.get("/", verifyAdmin, getAllBooking);

export default router;
