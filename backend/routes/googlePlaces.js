import express from "express";
import { getNearbyPlaces, getPlaceDetails, textSearch, getPlacePhoto } from "../controllers/googlePlacesController.js";

const router = express.Router();

router.get("/nearby", getNearbyPlaces);
router.get("/details", getPlaceDetails);
router.get("/textsearch", textSearch);
router.get("/photo", getPlacePhoto);

export default router;
