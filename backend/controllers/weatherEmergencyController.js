import axios from "axios";

// Map WMO Weather Codes to descriptions
const getWeatherDesc = (code) => {
    const codes = {
        0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing Rime Fog", 51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
        61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain", 71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
        77: "Snow Grains", 80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
        85: "Slight Snow Showers", 86: "Heavy Snow Showers", 95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Heavy Hail"
    };
    return codes[code] || "Variable";
};

// Known reliable coordinates for all 29 Indian States/capitals to avoid geocoding limits
const stateCoordinates = {
    "andhra pradesh": { lat: 16.5062, lon: 80.6480 }, // Amaravati/Vijayawada
    "arunachal pradesh": { lat: 27.0844, lon: 93.6053 }, // Itanagar
    "assam": { lat: 26.1158, lon: 91.7086 }, // Dispur/Guwahati
    "bihar": { lat: 25.5941, lon: 85.1376 }, // Patna
    "chhattisgarh": { lat: 21.2514, lon: 81.6296 }, // Raipur
    "goa": { lat: 15.4909, lon: 73.8278 }, // Panaji
    "gujarat": { lat: 23.2156, lon: 72.6369 }, // Gandhinagar
    "haryana": { lat: 30.7333, lon: 76.7794 }, // Chandigarh
    "himachal pradesh": { lat: 31.1048, lon: 77.1734 }, // Shimla
    "jharkhand": { lat: 23.3441, lon: 85.3096 }, // Ranchi
    "karnataka": { lat: 12.9716, lon: 77.5946 }, // Bangalore
    "kerala": { lat: 8.5241, lon: 76.9366 }, // Thiruvananthapuram
    "madhya pradesh": { lat: 23.2599, lon: 77.4126 }, // Bhopal
    "maharashtra": { lat: 19.0760, lon: 72.8777 }, // Mumbai
    "manipur": { lat: 24.8170, lon: 93.9368 }, // Imphal
    "meghalaya": { lat: 25.5788, lon: 91.8933 }, // Shillong
    "mizoram": { lat: 23.7271, lon: 92.7176 }, // Aizawl
    "nagaland": { lat: 25.6751, lon: 94.1086 }, // Kohima
    "odisha": { lat: 20.2961, lon: 85.8245 }, // Bhubaneswar
    "punjab": { lat: 30.7333, lon: 76.7794 }, // Chandigarh
    "rajasthan": { lat: 26.9124, lon: 75.7873 }, // Jaipur
    "sikkim": { lat: 27.3389, lon: 88.6065 }, // Gangtok
    "tamil nadu": { lat: 13.0827, lon: 80.2707 }, // Chennai
    "telangana": { lat: 17.3850, lon: 78.4867 }, // Hyderabad
    "tripura": { lat: 23.8315, lon: 91.2868 }, // Agartala
    "uttar pradesh": { lat: 26.8467, lon: 80.9462 }, // Lucknow
    "uttarakhand": { lat: 30.3165, lon: 78.0322 }, // Dehradun
    "west bengal": { lat: 22.5726, lon: 88.3639 }, // Kolkata
    "delhi": { lat: 28.6139, lon: 77.2090 } // Delhi
};

export const getWeather = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ success: false, message: "city query parameter is required" });
        }

        let latitude, longitude, resolvedName = city;
        const normalizedCity = city.toLowerCase().trim();

        if (stateCoordinates[normalizedCity]) {
            latitude = stateCoordinates[normalizedCity].lat;
            longitude = stateCoordinates[normalizedCity].lon;
        } else {
            // Geocode any searched cities that are not predefined states using Open-Meteo Geocoding
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
            const geoResponse = await axios.get(geoUrl, { timeout: 8000 });
            
            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                return res.status(404).json({ success: false, message: "Could not find precise weather for this location" });
            }
            latitude = geoResponse.data.results[0].latitude;
            longitude = geoResponse.data.results[0].longitude;
            resolvedName = geoResponse.data.results[0].name;
            if (geoResponse.data.results[0].country) resolvedName += `, ${geoResponse.data.results[0].country}`;
        }

        // Fetch highly accurate Real-Time weather & strictly skip caching with dynamic timezone
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover&hourly=visibility&daily=sunrise,sunset,uv_index_max&timezone=auto&_t=${Date.now()}`;
        const weatherResponse = await axios.get(weatherUrl, { timeout: 8000 });
        
        const currentData = weatherResponse.data.current;
        const getLocalTime = (isoString) => isoString ? isoString.split('T')[1] : 'N/A';

        const weather = {
            city: resolvedName,
            temperature: `${currentData.temperature_2m}°C`,
            feelsLike: `${currentData.apparent_temperature}°C`,
            description: getWeatherDesc(currentData.weather_code),
            humidity: `${currentData.relative_humidity_2m}%`,
            windSpeed: `${currentData.wind_speed_10m} km/h`,
            visibility: weatherResponse.data.hourly?.visibility?.[0] ? `${(weatherResponse.data.hourly.visibility[0] / 1000).toFixed(1)} km` : `N/A`,
            
            // Extended detailed metrics
            windDirection: `${currentData.wind_direction_10m}°`,
            pressure: `${currentData.surface_pressure} hPa`,
            cloudCover: `${currentData.cloud_cover}%`,
            uvIndex: weatherResponse.data.daily?.uv_index_max?.[0] || '1',
            sunrise: getLocalTime(weatherResponse.data.daily?.sunrise?.[0]),
            sunset: getLocalTime(weatherResponse.data.daily?.sunset?.[0]),
            
            observation_time: currentData.time,
        };

        // Standardized format expected by frontend
        res.status(200).json({
            success: true,
            message: "Real-time weather data fetched successfully",
            data: { current: weather, forecast: [] },
        });
    } catch (error) {
        console.error("Weather API error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch real-time weather data" });
    }
};

// Emergency contacts — hardcoded essential contacts by country
export const getEmergencyContacts = (req, res) => {
    const { country } = req.query;

    const emergencyData = {
        india: {
            country: "India",
            police: "100",
            ambulance: "108",
            fire: "101",
            women_helpline: "1091",
            tourist_helpline: "1363",
            disaster_management: "1078",
            contacts: [
                { name: "Police Control Room", number: "100", type: "police" },
                { name: "Ambulance / Medical Emergency", number: "108", type: "medical" },
                { name: "Fire Brigade", number: "101", type: "fire" },
                { name: "Tourist Helpline (Incredible India)", number: "1363", type: "tourist" },
                { name: "Women Helpline", number: "1091", type: "women_safety" },
                { name: "National Disaster Management", number: "1078", type: "disaster" },
            ],
        },
        "sri lanka": {
            country: "Sri Lanka",
            police: "119",
            ambulance: "110",
            fire: "111",
            tourist_helpline: "+94 11 242 1052",
            contacts: [
                { name: "Police Emergency", number: "119", type: "police" },
                { name: "Ambulance / Accident", number: "110", type: "medical" },
                { name: "Fire & Rescue", number: "111", type: "fire" },
                { name: "Tourist Police", number: "+94 11 242 1052", type: "tourist" },
            ],
        },
        usa: {
            country: "United States",
            police: "911",
            ambulance: "911",
            fire: "911",
            contacts: [
                { name: "Emergency Services (Police/Fire/Medical)", number: "911", type: "general" },
                { name: "Poison Control", number: "1-800-222-1222", type: "medical" },
            ],
        },
        uk: {
            country: "United Kingdom",
            police: "999",
            ambulance: "999",
            fire: "999",
            contacts: [
                { name: "Emergency Services", number: "999", type: "general" },
                { name: "Non-Emergency Police", number: "101", type: "police" },
                { name: "NHS Health Advice", number: "111", type: "medical" },
            ],
        },
        default: {
            country: "International",
            police: "Local emergency number",
            ambulance: "Local emergency number",
            contacts: [
                { name: "International SOS", number: "+44 20 8762 8008", type: "general" },
                { name: "Local Embassy/Consulate", number: "Check your country's embassy website", type: "embassy" },
            ],
            tip: "Save your country's embassy contact number before traveling.",
        },
    };

    if (!country) {
        return res.json({
            success: true,
            message: "All emergency contacts",
            data: emergencyData,
        });
    }

    const key = country.toLowerCase().trim();
    const result = emergencyData[key] || emergencyData["default"];

    res.json({
        success: true,
        message: `Emergency contacts for ${result.country}`,
        data: result,
    });
};
