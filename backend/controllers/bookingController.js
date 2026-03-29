import Booking from "./../models/Booking.js";

// create new booking
export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);

  try {
    const savedBooking = await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Your tour is booked!",
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

// public booking (no strict auth required — verifyToken still checks cookie if present)
export const createBookingPublic = async (req, res) => {
  try {
    const payload = {
      userId: req.body.userId || null,
      userEmail: req.body.userEmail || null,
      tourName: req.body.tourName,
      fullName: req.body.fullName,
      guestSize: req.body.guestSize,
      phone: req.body.phone,
      bookAt: req.body.bookAt,
      totalAmount: req.body.totalAmount,
    };

    const newBooking = new Booking(payload);
    const savedBooking = await newBooking.save();

    res.status(200).json({ success: true, message: "Booking created", data: savedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get single booking
export const getBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Booking.findById(id);
    res.status(200).json({ success: true, message: "Successful!", data: book });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found!" });
  }
};

// get all bookings for a specific user
export const getBookingsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "Successful!", data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

// get all bookings (admin only)
export const getAllBooking = async (req, res) => {
  try {
    const books = await Booking.find();
    res.status(200).json({ success: true, message: "Successful!", data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};
