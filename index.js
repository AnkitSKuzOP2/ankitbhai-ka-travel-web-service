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
import recommendRoute from "./routes/recommend.js";
import interactionsRoute from "./routes/interactions.js";

const app = express();
const port = 4000;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// MongoDB connection (Compass/localhost)
const mongoURL = "mongodb://localhost:27017/tour-booking";

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("error", () => {
  console.log("MongoDB connection failed");
});

connection.once("open", () => {
  console.log("MongoDB connection successful (localhost)");
});

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/places", placesRoute);
app.use("/api/v1/guides", guidesRoute);
app.use("/api/v1/recommendations", recommendRoute);
app.use("/api/v1/interactions", interactionsRoute);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
