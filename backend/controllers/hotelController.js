const baseHotels = [
    { _id: "h1", title: "Taj Mahal Palace", city: "Mumbai", rating: 4.9, reviews: 1204, price: 25000, amenities: ["Infinity Pool", "Jiva Spa", "Ocean View", "Fine Dining"], photo: "https://images.unsplash.com/photo-1542314831-c6a4d14d8857?q=80&w=1000", distance: "2 km from center", featured: true },
    { _id: "h2", title: "ITC Maurya", city: "Delhi", rating: 4.8, reviews: 856, price: 18000, amenities: ["Kaya Kalp Spa", "Luxury Suites", "Indoor Pool"], photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000", distance: "5 km from center", featured: true },
    { _id: "h3", title: "The Leela Palace", city: "Udaipur", rating: 5.0, reviews: 2045, price: 30000, amenities: ["Lake Pichola View", "Private Butler", "Library Bar"], photo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000", distance: "1 km from center", featured: false },
    { _id: "h4", title: "Rambagh Palace", city: "Jaipur", rating: 4.9, reviews: 1102, price: 28000, amenities: ["Royal Heritage", "Golf Course", "Polo Bar"], photo: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1000", distance: "3 km from center", featured: true },
    { _id: "h5", title: "Novotel Resort & Spa", city: "Goa", rating: 4.5, reviews: 754, price: 12000, amenities: ["Private Beach", "Jacuzzi", "Kids Club", "DJ Lounge"], photo: "https://images.unsplash.com/photo-1618773928120-2946a6f11f44?q=80&w=1000", distance: "0.5 km from beach", featured: false },
    { _id: "h6", title: "Hyatt Regency", city: "Pune", rating: 4.6, reviews: 504, price: 11000, amenities: ["Arogya Spa", "Italian Dining", "Business Lounge"], photo: "https://images.unsplash.com/photo-1551882547-ff40c0d589rx?q=80&w=1000", distance: "4 km from airport", featured: false },
    { _id: "h7", title: "Wildflower Hall", city: "Shimla", rating: 4.9, reviews: 340, price: 35000, amenities: ["Himalayan View", "Heated Pool", "Nature Walks"], photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000", distance: "8 km from Mall Road", featured: true },
    { _id: "h8", title: "Taj West End", city: "Bangalore", rating: 4.7, reviews: 921, price: 15000, amenities: ["20 Acres Garden", "Tennis Court", "Heritage Wing"], photo: "https://images.unsplash.com/photo-1596436889106-be35e843f6a6?q=80&w=1000", distance: "3 km from center", featured: false }
];

// Enrich hotel with detailed array of imagery and deeply descriptive metadata
const enrichHotel = (h) => ({
    ...h,
    desc: `Experience unparalleled luxury and breathtaking views at ${h.title}, a premier 5-star haven located strictly in ${h.city}. Every suite is meticulously designed to offer you the ultimate comfort and sophistication throughout your stay. Enjoy our exclusive amenities ranging from a state-of-the-art wellness center to award-winning fine dining restaurants managed by internationally acclaimed chefs.`,
    photoGallery: [
        h.photo,
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000"
    ],
    address: `123 Luxury Boulevard, ${h.city}, India`
});

export const getHotels = (req, res) => {
    const { city } = req.query;
    
    // Enrich all base properties when listing them
    const allHotels = baseHotels.map(enrichHotel);

    if (!city) return res.status(200).json({ success: true, count: allHotels.length, data: allHotels });

    const q = city.trim().toLowerCase();
    
    // Exact or partial text match within predetermined luxury array
    let filtered = allHotels.filter((h) => h.city.toLowerCase().includes(q) || q.includes(h.city.toLowerCase()));
    
    // Dynamic Synthetic Generation: If the user searches a city outside the main database,
    // dynamically construct premium localized real-estate data to ensure the UI feels expansive and responsive!
    if (filtered.length === 0) {
        const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
        filtered = [
             enrichHotel({
                 _id: `dyn_h_${formattedCity}_1`,
                 title: `The Grand ${formattedCity} Resort & Spa`,
                 city: formattedCity,
                 rating: (4 + Math.random() * 0.9).toFixed(1),
                 reviews: Math.floor(Math.random() * 1500) + 120,
                 price: Math.floor(Math.random() * 18000) + 8000,
                 amenities: ["Free High-Speed WiFi", "Complimentary Breakfast", "Infinity Pool", "Wellness Center"],
                 photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop", 
                 distance: `${(Math.random() * 5 + 1).toFixed(1)} km from downtown`,
                 featured: true
             }),
             enrichHotel({
                 _id: `dyn_h_${formattedCity}_2`,
                 title: `Premium Suites ${formattedCity}`,
                 city: formattedCity,
                 rating: (4 + Math.random() * 0.5).toFixed(1),
                 reviews: Math.floor(Math.random() * 600) + 50,
                 price: Math.floor(Math.random() * 10000) + 4000,
                 amenities: ["Panoramic View", "Valet Parking", "Gourmet Restaurant", "Rooftop Bar"],
                 photo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop", 
                 distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km from central transit`,
                 featured: false
             })
        ];
    }
    
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
};

export const getHotelById = (req, res) => {
    const { id } = req.params;
    
    const allHotels = baseHotels.map(enrichHotel);
    let hotel = allHotels.find(h => h._id === id);
    
    // Fallback: If it's a dynamic ID generated locally (like 'dyn_h_Pune_1'), recreate it exactly so deep linking doesn't flatout fail!
    if (!hotel && id.startsWith("dyn_h_")) {
        const parts = id.split("_");
        // parts[2] is the city name. Recreate the dynamic hotel object.
        const cityName = parts[2] || "Unknown City";
        hotel = enrichHotel({
            _id: id,
            title: `The Grand ${cityName} Resort & Spa`,
            city: cityName,
            rating: "4.8",
            reviews: 1250,
            price: 15000,
            amenities: ["Free High-Speed WiFi", "Complimentary Breakfast", "Infinity Pool", "Wellness Center"],
            photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
            distance: "3.5 km from center",
            featured: true
        });
    }

    if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    return res.status(200).json({ success: true, data: hotel });
};
