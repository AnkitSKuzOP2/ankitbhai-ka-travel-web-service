import express from "express";
import { getWeather, getEmergencyContacts } from "../controllers/weatherEmergencyController.js";

const router = express.Router();

router.get("/weather", getWeather);
router.get("/emergency", getEmergencyContacts);

export default router;
