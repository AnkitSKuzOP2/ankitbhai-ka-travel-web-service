export const getGuides = (req, res) => {
  const { city } = req.query;

  // sample guides data (could be moved to DB later)
  const guides = [
    { id: "g1", name: "Ravi Kumar", languages: ["English", "Hindi"], rating: 4.9, pricePerDay: 30, city: "Delhi" },
    { id: "g2", name: "Sita Sharma", languages: ["English"], rating: 4.8, pricePerDay: 35, city: "Mumbai" },
    { id: "g3", name: "Mohit Singh", languages: ["English", "Hindi"], rating: 4.7, pricePerDay: 25, city: "Delhi" },
    { id: "g4", name: "Anita Perera", languages: ["English"], rating: 4.6, pricePerDay: 28, city: "Kandy" },
    { id: "g5", name: "Akash Raj", languages: ["English", "Hindi"], rating: 4.5, pricePerDay: 20, city: "Colombo" },
  ];

  if (!city) return res.json({ success: true, data: guides });

  const q = city.toLowerCase();
  const filtered = guides.filter((g) => g.city.toLowerCase().includes(q) || q.includes(g.city.toLowerCase()));
  return res.json({ success: true, data: filtered });
};
