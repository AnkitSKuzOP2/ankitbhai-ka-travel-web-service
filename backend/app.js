import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import tourRoute from "./routes/tour.js";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import reviewRoute from "./routes/reviews.js";
import bookingRoute from "./routes/bookings.js";
import placesRoute from "./routes/googlePlaces.js";
import guidesRoute from "./routes/guides.js";
import recommendationsRoute from "./routes/recommend.js";
import interactionsRoute from "./routes/interactions.js";
import weatherEmergencyRoute from "./routes/weatherEmergency.js";
import hotelsRoute from "./routes/hotels.js";
import subscriberRoute from "./routes/subscribers.js";
import feedbackRoute from "./routes/feedback.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

const mongoURL = process.env.MONGO_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/tour-booking";

mongoose
  .connect(mongoURL, {
    family: 4,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/places", placesRoute);
app.use("/api/v1/guides", guidesRoute);
app.use("/api/v1/recommendations", recommendationsRoute);
app.use("/api/v1/interactions", interactionsRoute);
app.use("/api/v1/services", weatherEmergencyRoute);
app.use("/api/v1/hotels", hotelsRoute);
app.use("/api/v1/subscribers", subscriberRoute);
app.use("/api/v1/feedback", feedbackRoute);

app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
