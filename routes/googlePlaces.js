import express from "express";
import { getNearbyPlaces, getPlaceDetails, textSearch } from "../controllers/googlePlacesController.js";

const router = express.Router();

router.get("/nearby", getNearbyPlaces);
router.get("/details", getPlaceDetails);
router.get("/textsearch", textSearch);

export default router;
