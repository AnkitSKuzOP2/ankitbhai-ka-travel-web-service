import mongoose from "mongoose";
import dotenv from "dotenv";
import Tour from "./models/Tour.js";
import Review from "./models/Review.js";

dotenv.config({ path: "../.env" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tours = [
    {
        title: "Taj Mahal — Crown of Palaces",
        city: "Agra",
        address: "Dharmapuri, Forest Colony, Tajganj",
        distance: 210,
        photo: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
        desc: "Stand before the world's most iconic symbol of love — the Taj Mahal. Built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, this UNESCO World Heritage Site is an architectural masterpiece of white marble inlaid with precious stones. Visit at sunrise for an unforgettable golden glow over the reflecting pool. Explore the sprawling Mughal gardens, the grand gateway, the mosque, and the mausoleum complex.",
        price: 1200, maxGroupSize: 20, featured: true,
    },
    {
        title: "Goa Beach Paradise",
        city: "Goa",
        address: "Calangute Beach, North Goa",
        distance: 1440,
        photo: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        desc: "Experience India's premier beach destination with its perfect blend of sun, sand, and vibrant nightlife. Goa offers 100+ kilometres of golden beaches from the lively Calangute and Baga in the north to the tranquil Palolem in the south. Explore UNESCO-listed churches of Old Goa, cruise on the Mandovi River at sunset, savour fresh seafood at shacks, and dive into water sports including parasailing, jet-skiing, and scuba diving.",
        price: 3500, maxGroupSize: 15, featured: true,
    },
    {
        title: "Kerala Backwaters Houseboat Stay",
        city: "Alleppey",
        address: "Alleppey Boat Jetty, Alappuzha",
        distance: 1200,
        photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        desc: "Drift through emerald-green backwaters on a traditional Kettuvallam houseboat — the most romantic way to experience Kerala. Glide past paddy fields, coconut groves, fishing villages, and ancient Chinese fishing nets through 1500 km of canals, rivers, and lakes. Your private houseboat includes a chef preparing authentic Kerala meals including fish curry, appam, and puttu.",
        price: 4500, maxGroupSize: 8, featured: true,
    },
    {
        title: "Manali Snow Adventure",
        city: "Manali",
        address: "Mall Road, Old Manali",
        distance: 540,
        photo: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
        desc: "Nestled at 2050 metres altitude in the Kullu Valley, Manali is India's adventure capital. Trek through dense deodar forests to Jogini Waterfall, ski across Solang Valley snow fields, and jeep safari over the thrilling Rohtang Pass at 3978m. Visit the 450-year-old Hadimba Temple carved into a cedar forest, stroll through Old Manali's hippie cafes and craft shops.",
        price: 2800, maxGroupSize: 12, featured: true,
    },
    {
        title: "Jaipur — The Pink City Royal Tour",
        city: "Jaipur",
        address: "City Palace Complex, Tripolia Bazar",
        distance: 280,
        photo: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
        desc: "Step into the royal world of the Rajput kings in Jaipur, the Pink City of Rajasthan. Marvel at the five-storey Hawa Mahal, explore the opulent City Palace, and gaze at Jantar Mantar. Ride an elephant to Amber Fort, wander vibrant bazaars for bangles and block-print textiles, and savour Rajasthani cuisine including dal baati churma.",
        price: 2200, maxGroupSize: 18, featured: true,
    },
    {
        title: "Varanasi — Spiritual Journey on the Ganges",
        city: "Varanasi",
        address: "Dashashwamedh Ghat, Varanasi",
        distance: 320,
        photo: "https://images.unsplash.com/photo-1561361058-c24e971a8b66?w=800&q=80",
        desc: "Witness the eternal cycle of life on the banks of the sacred Ganges in one of the world's oldest cities at over 3000 years. Take a sunrise boat ride on the ghats, watch the mesmerizing Ganga Aarti with fire and chanting, explore the old city's ancient temples, and taste Banarasi paan and chaat. Visit Sarnath where the Buddha gave his first sermon.",
        price: 1800, maxGroupSize: 16, featured: false,
    },
    {
        title: "Leh-Ladakh — Roof of the World",
        city: "Leh",
        address: "Main Bazaar Road, Leh",
        distance: 1100,
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        desc: "Journey to the world's highest motorable roads in the breathtaking high-altitude desert of Ladakh. Visit the cobalt-blue Pangong Lake at 4350m, cross Khardung La at 5602m, explore ancient monasteries at Thiksey and Hemis, and watch the dramatic Indus-Zanskar river confluence. The stark lunar landscape with turquoise rivers and fluttering prayer flags is otherworldly.",
        price: 6500, maxGroupSize: 10, featured: true,
    },
    {
        title: "Rishikesh — Yoga and River Rafting Capital",
        city: "Rishikesh",
        address: "Laxman Jhula, Tapovan",
        distance: 240,
        photo: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
        desc: "Perched where the Ganges emerges from the Himalayas, Rishikesh is the Yoga Capital of the World and India's adventure-sports hub. Take morning yoga classes, meditate in ashrams, attend the Ganga Aarti at Parmarth Niketan. Then raft Grade IV rapids at Shivpuri, bungee jump from 83m (India's highest), zip-line over the Ganges, and trek to Neer Garh waterfall.",
        price: 2500, maxGroupSize: 14, featured: true,
    },
    {
        title: "Udaipur — City of Lakes",
        city: "Udaipur",
        address: "Lake Pichola, City Palace Road",
        distance: 665,
        photo: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
        desc: "Called the Venice of the East, Udaipur captivates with shimmering lakes, white-marble palaces, and romantic haveli architecture. Sunset boat ride on Lake Pichola to see the fairytale floating Lake Palace, explore the City Palace's crystal galleries and peacock courtyards, shop for silver jewellery and miniature paintings, and dine at rooftop restaurants with panoramic lake views.",
        price: 2600, maxGroupSize: 15, featured: true,
    },
    {
        title: "Hampi — Ruins of the Vijayanagara Empire",
        city: "Hampi",
        address: "Hampi Bazaar, Bellary District",
        distance: 340,
        photo: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80",
        desc: "Explore one of the world's most dramatic UNESCO Heritage Sites — ruins of the 14th-century Vijayanagara Empire across a surreal boulder landscape on the Tungabhadra River. Climb Matanga Hill at sunrise for a panoramic view of 500 monuments, wander the Vittala Temple's stone chariot and musical pillars, and discover the 700-year-old Virupaksha Temple still in active use.",
        price: 1500, maxGroupSize: 20, featured: false,
    },
    {
        title: "Andaman Islands — Tropical Scuba Paradise",
        city: "Port Blair",
        address: "Aberdeen Bazaar, Port Blair",
        distance: 1190,
        photo: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
        desc: "Discover India's best-kept secret — 572 islands in the Bay of Bengal with Asia's finest beaches and vibrant coral reefs. Snorkel at Radhanagar Beach (ranked Asia's best by Time magazine), take a glass-bottom boat at Neil Island, experience bioluminescent plankton beaches, and scuba dive with manta rays, sea turtles, and clownfish. The historical Cellular Jail adds powerful context.",
        price: 7200, maxGroupSize: 10, featured: true,
    },
    {
        title: "Darjeeling — Queen of Hills Tea Tour",
        city: "Darjeeling",
        address: "Mall Road, Darjeeling",
        distance: 660,
        photo: "https://images.unsplash.com/photo-1571004823816-c3bdb4f2c0b7?w=800&q=80",
        desc: "Perched at 2042 metres, Darjeeling offers magical views of Kangchenjunga and is home of the world's finest tea. Watch the sunrise from Tiger Hill as Kangchenjunga turns golden, tour a working tea estate and factory, ride the UNESCO Kalka-Shimla Toy Train across the Batasia Loop, and explore the Himalayan Mountaineering Institute where Tenzing Norgay trained.",
        price: 3200, maxGroupSize: 12, featured: false,
    },
    {
        title: "Mysore — Palace City of South India",
        city: "Mysore",
        address: "Sayyaji Rao Road, Mysore",
        distance: 145,
        photo: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&q=80",
        desc: "Mysore's glittering Maharaja's Palace is illuminated by 98000 light bulbs every Sunday — a sight not to be missed. During the Dasara festival it becomes India's grandest royal celebration. Visit the opulent Indo-Saracenic palace interior with stained-glass ceilings and gem-encrusted throne, climb Chamundi Hill, shop for Mysore silk sarees, and taste the royal Mysore Pak sweet.",
        price: 1900, maxGroupSize: 20, featured: false,
    },
    {
        title: "Coorg — Scotland of India Coffee Trails",
        city: "Coorg",
        address: "Madikeri Town, Kodagu District",
        distance: 260,
        photo: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
        desc: "Tucked in the Western Ghats, Coorg is India's premier coffee-growing region — a verdant hill station draped in mist, cascading waterfalls, and rolling estates of coffee, cardamom, and pepper. Walk aromatic coffee plantations, plunge into Abbey Falls, white-water raft the Barapole River, and experience a homestay with the indigenous Kodava community for authentic cuisine.",
        price: 2400, maxGroupSize: 12, featured: false,
    },
    {
        title: "Shimla — Heritage Hill Station",
        city: "Shimla",
        address: "The Mall Road, Shimla",
        distance: 370,
        photo: "https://images.unsplash.com/photo-1586016413664-864c0dd76af3?w=800&q=80",
        desc: "The former summer capital of British India, Shimla sits at 2206 metres with unique Victorian architecture and sweeping Himalayan views. Stroll the traffic-free Mall Road and Ridge lined with colonial buildings, visit the neo-Gothic Christ Church, hike to the Jakhu Temple, and ride the UNESCO-listed Kalka-Shimla narrow-gauge toy railway through 103 tunnels and 864 bridges.",
        price: 2100, maxGroupSize: 16, featured: false,
    },
];

const reviewSamples = [
    { reviewText: "Absolutely breathtaking! One of the best trips of my life.", rating: 5, username: "Rahul Sharma" },
    { reviewText: "Wonderful experience, the guide was very knowledgeable and friendly.", rating: 5, username: "Priya Patel" },
    { reviewText: "Great tour, well organized. Would definitely recommend to all.", rating: 4, username: "Amit Verma" },
    { reviewText: "Beautiful destination, the photos don't do it justice!", rating: 5, username: "Sunita Kapoor" },
    { reviewText: "Amazing experience! Everything was perfectly arranged and on time.", rating: 4, username: "Vikram Singh" },
    { reviewText: "Loved every moment of the trip. The local food was incredible.", rating: 5, username: "Deepa Nair" },
    { reviewText: "Good trip overall, slightly crowded during peak season.", rating: 3, username: "Arjun Menon" },
    { reviewText: "The scenery was jaw-dropping. Will definitely come back again!", rating: 5, username: "Kavya Reddy" },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 60000,
        });
        console.log("✅ MongoDB connected");

        await Tour.deleteMany({});
        await Review.deleteMany({});
        console.log("🗑️  Cleared existing tours and reviews\n");

        let seeded = 0;
        for (const tourData of tours) {
            try {
                const tour = new Tour(tourData);
                const numReviews = Math.floor(Math.random() * 3) + 2;
                const reviewIds = [];

                for (let i = 0; i < numReviews; i++) {
                    const sample = reviewSamples[Math.floor(Math.random() * reviewSamples.length)];
                    const review = new Review({
                        productId: tour._id,
                        username: sample.username,
                        reviewText: sample.reviewText,
                        rating: sample.rating,
                    });
                    await review.save();
                    reviewIds.push(review._id);
                }

                tour.reviews = reviewIds;
                await tour.save();
                seeded++;
                console.log(`  ✅ [${seeded}/${tours.length}] Seeded: ${tourData.title}`);
                await sleep(300);
            } catch (err) {
                console.error(`  ❌ Failed to seed "${tourData.title}": ${err.message}`);
            }
        }

        console.log(`\n🎉 Done! ${seeded}/${tours.length} tours seeded successfully!`);
        console.log("👉 Restart your backend server to serve the new data.");
        process.exit(0);
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

seedDB();
