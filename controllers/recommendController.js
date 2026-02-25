import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

// Simple content-based recommender
// Supports seed by tourId or city query param. Returns scored tours.
export const getRecommendations = async (req, res) => {
  try {
    const { tourId, city, limit = 10 } = req.query;

    let seedTour = null;
    if (tourId) seedTour = await Tour.findById(tourId).lean();

    // Build candidate set: same city if available, else all
    const cityFilter = seedTour ? { city: seedTour.city } : city ? { city } : {};

    const candidates = await Tour.find(cityFilter).lean();

    // Precompute average ratings
    const ratings = await Review.aggregate([
      { $group: { _id: "$productId", avgRating: { $avg: "$rating" } } },
    ]);
    const ratingMap = {};
    ratings.forEach((r) => (ratingMap[r._id.toString()] = r.avgRating));

    // If no seed and many candidates, expand to global sample
    const candidateList = candidates.length ? candidates : await Tour.find({}).limit(50).lean();

    // Score function
    const scores = candidateList.map((t) => {
      const avgRating = ratingMap[t._id.toString()] || 0;
      let score = 0;
      if (seedTour) {
        // city match
        score += t.city === seedTour.city ? 1.0 : 0.0;
        // featured boost
        score += t.featured ? 0.5 : 0.0;
        // price closeness (normalized)
        const priceRange = Math.max(1, Math.abs(seedTour.price - t.price));
        const priceScore = 1 / (1 + priceRange / Math.max(1, seedTour.price));
        score += 0.5 * priceScore;
      } else {
        // fallback: prefer featured and rated
        score += t.featured ? 1.0 : 0.0;
      }
      score += 1.0 * (avgRating / 5.0);
      return { tour: t, score };
    });

    scores.sort((a, b) => b.score - a.score);

    const results = scores.slice(0, Number(limit)).map((s) => ({ ...s.tour, score: s.score }));

    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to compute recommendations" });
  }
};
