import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const getNearbyPlaces = async (req, res) => {
  try {
    const { location, radius = 5000, type } = req.query;
    if (!location) return res.status(400).json({ message: "location query required as lat,lng" });

    const params = new URLSearchParams({ location, radius: String(radius), key: GOOGLE_API_KEY });
    if (type) params.append("type", type);

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
    const response = await axios.get(url);
    return res.json(response.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getPlaceDetails = async (req, res) => {
  try {
    const { place_id, fields = "name,rating,reviews,formatted_address,geometry,photos" } = req.query;
    if (!place_id) return res.status(400).json({ message: "place_id query required" });

    const params = new URLSearchParams({ place_id, fields, key: GOOGLE_API_KEY });
    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
    const response = await axios.get(url);
    return res.json(response.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const textSearch = async (req, res) => {
  try {
    const { query, type, radius = 5000 } = req.query;
    if (!query) return res.status(400).json({ message: "query parameter required" });

    const params = new URLSearchParams({ query, key: GOOGLE_API_KEY });
    if (type) params.append("type", type);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;
    const response = await axios.get(url);
    return res.json(response.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// Proxy for Google Places photos — avoids CORS from the frontend
export const getPlacePhoto = async (req, res) => {
  try {
    const { photo_reference, maxwidth = 400 } = req.query;
    if (!photo_reference) return res.status(400).json({ message: "photo_reference required" });

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "YOUR_GOOGLE_PLACES_API_KEY") {
      return res.status(503).json({ message: "Google API key not configured" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photo_reference}&key=${GOOGLE_API_KEY}`;
    // Follow the redirect from Google (returns the actual image)
    const response = await axios.get(url, { responseType: "stream" });
    res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    response.data.pipe(res);
  } catch (err) {
    console.error("Photo proxy error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
