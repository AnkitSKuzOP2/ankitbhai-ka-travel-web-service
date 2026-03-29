import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "reactstrap";
import { BASE_URL } from "../utils/config";
import "../styles/weather.css";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const getWeatherConfig = (description) => {
  const desc = (description || "").toLowerCase();
  if (desc.includes("rain") || desc.includes("drizzle")) {
    return { icon: "ri-rainy-fill", color: "#3b82f6", gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", text: "text-primary" };
  } else if (desc.includes("thunder")) {
    return { icon: "ri-hail-fill", color: "#6366f1", gradient: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)", text: "text-indigo" };
  } else if (desc.includes("snow")) {
    return { icon: "ri-snowy-fill", color: "#06b6d4", gradient: "linear-gradient(135deg, #67e8f9 0%, #06b6d4 100%)", text: "text-info" };
  } else if (desc.includes("cloud") || desc.includes("overcast")) {
    return { icon: "ri-cloudy-fill", color: "#64748b", gradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)", text: "text-secondary" };
  } else if (desc.includes("fog")) {
    return { icon: "ri-mist-fill", color: "#9ca3af", gradient: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)", text: "text-muted" };
  } else {
    // Clear / Sunny
    return { icon: "ri-sun-fill", color: "#f59e0b", gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)", text: "text-warning" };
  }
};

const HeroWeatherCard = ({ data, city }) => {
  if (!data?.current) return null;
  const { current } = data;
  const config = getWeatherConfig(current.description);

  return (
    <div className="hero-weather-card mb-5 text-white shadow-lg overflow-hidden" style={{ background: config.gradient, borderRadius: "30px", position: "relative" }}>
      <div className="weather-bg-overlay"></div>
      <div className="p-5" style={{ position: "relative", zIndex: 2 }}>
        <Row className="align-items-center">
          <Col md="7" className="text-start">
            <h1 className="fw-bolder display-3 mb-0" style={{ letterSpacing: "-1px" }}>{city}</h1>
            <p className="fs-5 opacity-75 mt-2 mb-4"><i className="ri-map-pin-2-fill me-2"></i>Live Location Feed</p>
            <div className="d-flex align-items-end mb-4 gap-3">
              <h1 className="display-1 fw-bold mb-0 lh-1">{current.temperature.split(" / ")[0]}</h1>
              <div className="pb-2">
                <span className="fs-4 d-block fw-light">{current.description}</span>
                <span className="opacity-75">Feels like {current.feelsLike}</span>
              </div>
            </div>
            
            <div className="weather-hero-metrics d-flex flex-wrap p-3 rounded-4" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", gap: "1.5rem" }}>
              <div title="Humidity"><i className="ri-drop-fill mb-1 text-white"></i> {current.humidity}</div>
              <div className="border-start border-white border-opacity-25 ps-4" title="Wind"><i className="ri-windy-fill mb-1 text-white"></i> {current.windSpeed}</div>
              <div className="border-start border-white border-opacity-25 ps-4" title="Visibility"><i className="ri-eye-fill mb-1 text-white"></i> {current.visibility}</div>
              <div className="border-start border-white border-opacity-25 ps-4" title="UV Index max"><i className="ri-sun-fill mb-1" style={{ color: "#ffd700" }}></i> UV {current.uvIndex}</div>
              
              <div className="w-100 mt-1 pt-3 border-top border-white border-opacity-25 d-flex flex-wrap gap-4">
                 <div title="Sunrise Time"><i className="ri-sunrise-fill" style={{ color: "#ffd700" }}></i> {current.sunrise}</div>
                 <div className="border-start border-white border-opacity-25 ps-4" title="Sunset Time"><i className="ri-sunset-fill" style={{ color: "#ff8c00" }}></i> {current.sunset}</div>
                 <div className="border-start border-white border-opacity-25 ps-4" title="Atmospheric Pressure"><i className="ri-dashboard-3-fill text-white"></i> {current.pressure}</div>
                 <div className="border-start border-white border-opacity-25 ps-4" title="Cloud Cover"><i className="ri-cloud-fill text-white"></i> {current.cloudCover}</div>
              </div>
            </div>
          </Col>
          <Col md="5" className="text-end d-none d-md-block">
             <i className={`${config.icon} weather-hero-icon`} style={{ fontSize: "12rem", opacity: 0.9, filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))" }}></i>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const WeatherCard = ({ data, loading, error, city }) => {
  if (loading) {
    return (
      <div className="weather-card loading shadow-sm rounded-4 border-0">
        <div className="skeleton-line title w-75 mb-4"></div>
        <div className="d-flex justify-content-between">
           <div className="skeleton-line w-50 h-50"></div>
           <div className="skeleton-circle icon"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card error shadow-sm p-4 text-center rounded-4 border-0">
        <div className="error-icon-wrapper mx-auto mb-3 text-danger bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
            <i className="ri-cloud-off-fill fs-2"></i>
        </div>
        <h5 className="fw-bold text-dark">{city}</h5>
        <p className="text-muted small mb-0">Offline</p>
      </div>
    );
  }

  if (!data?.current) return null;

  const { current } = data;
  const config = getWeatherConfig(current.description);

  return (
    <div className="weather-card shadow-sm p-4 rounded-4 bg-white border-0 position-relative overflow-hidden">
      <div className="position-absolute top-0 end-0 p-3 opacity-25" style={{ zIndex: 0 }}>
        <i className={config.icon} style={{ fontSize: "5rem", color: config.color, transform: "translate(20%, -30%)" }}></i>
      </div>
      
      <div className="position-relative" style={{ zIndex: 1 }}>
        <h5 className="fw-bold mb-3 text-dark">{city}</h5>
        
        <div className="d-flex align-items-end gap-2 mb-3">
          <h2 className="fw-bolder mb-0 text-dark" style={{ letterSpacing: "-1px" }}>{current.temperature.split(" / ")[0]}</h2>
          <span className={`fw-medium pb-1 ${config.text}`} style={{ fontSize: "0.9rem" }}>{current.description}</span>
        </div>
        
        <Row className="small text-muted g-2 mt-4 pt-3 border-top border-light">
          <Col xs="6" className="d-flex align-items-center gap-2" title="Humidity">
            <i className="ri-drop-fill text-info border p-1 rounded bg-light"></i>
            <span className="fw-medium">{current.humidity}</span>
          </Col>
          <Col xs="6" className="d-flex align-items-center gap-2" title="Wind Speed">
            <i className="ri-windy-fill text-primary border p-1 rounded bg-light"></i>
            <span className="fw-medium text-truncate">{current.windSpeed}</span>
          </Col>
          <Col xs="6" className="d-flex align-items-center gap-2 mt-3" title="Sunrise">
            <i className="ri-sunrise-fill border p-1 rounded bg-light" style={{ color: "#ff8c00" }}></i>
            <span className="fw-medium text-truncate">{current.sunrise}</span>
          </Col>
          <Col xs="6" className="d-flex align-items-center gap-2 mt-3" title="Sunset">
            <i className="ri-sunset-fill border p-1 rounded bg-light" style={{ color: "#e65100" }}></i>
            <span className="fw-medium text-truncate">{current.sunset}</span>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const Weather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedWeather, setSearchedWeather] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  const [statesWeather, setStatesWeather] = useState({});

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(`${BASE_URL}/services/weather?city=${encodeURIComponent(city)}&_t=${Date.now()}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch");
      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError(null);

    const result = await fetchWeather(searchQuery);
    if (result.error) {
      setSearchError(result.error);
      setSearchedWeather(null);
    } else {
      setSearchedWeather({ city: searchQuery, data: result.data });
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    
    const updateStatesWeatherSilently = async () => {
      for (const state of indianStates) {
        if (!isMounted) return;
        // eslint-disable-next-line no-loop-func
        fetchWeather(state).then((result) => {
          if (!isMounted) return;
          setStatesWeather(prev => ({
            ...prev,
            [state]: {
              loading: false,
              data: result.data || prev[state]?.data,
              error: result.error
            }
          }));
        });
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    };

    const loadStatesWeather = async () => {
      const initObj = {};
      indianStates.forEach(state => {
        initObj[state] = { loading: true, data: null, error: null };
      });
      setStatesWeather(initObj);
      await updateStatesWeatherSilently();
    };

    loadStatesWeather();

    const intervalId = setInterval(() => {
       updateStatesWeatherSilently();
       setSearchQuery(currentQuery => {
           if (currentQuery) {
               fetchWeather(currentQuery).then(res => {
                   if (isMounted && res.data) setSearchedWeather({ city: currentQuery, data: res.data });
               });
           }
           return currentQuery;
       });
    }, 180000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <section className="weather-hero-banner text-center text-white py-5 position-relative">
         <div className="container py-4 position-relative z-2">
            <h1 className="display-4 fw-bolder mb-3">Global Weather <span className="text-warning">Hub</span></h1>
            <p className="fs-5 opacity-75 mx-auto" style={{ maxWidth: "600px" }}>Monitor real-time, ultra-precise weather statuses for any destination in the world before your next journey.</p>
         </div>
      </section>
      
      <section className="weather-content-section" style={{ marginTop: "-60px", position: "relative", zIndex: 10 }}>
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg="10">
              <div className="search-weather-box p-4 bg-white rounded-pill shadow-lg d-flex align-items-center">
                <Form onSubmit={handleSearch} className="d-flex align-items-center w-100 gap-3">
                  <div className="search-input-wrap flex-grow-1 position-relative">
                     <i className="ri-map-pin-2-fill position-absolute text-primary" style={{ left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "1.4rem" }}></i>
                     <input 
                      type="text" 
                      placeholder="Search any global destination..." 
                      className="form-control rounded-pill border-0 bg-light"
                      style={{ paddingLeft: "55px", height: "60px", fontSize: "1.1rem" }}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="btn btn-warning rounded-pill fw-bold text-dark d-flex align-items-center gap-2" style={{ height: "60px", padding: "0 40px", fontSize: "1.1rem" }}>
                    {searchLoading ? <div className="spinner-border spinner-border-sm text-dark"></div> : <i className="ri-search-2-line"></i>}
                    Explore
                  </Button>
                </Form>
              </div>

              {searchError && (
                 <div className="mt-4 alert alert-danger rounded-4 d-flex align-items-center shadow-sm">
                    <i className="ri-error-warning-fill fs-3 me-3"></i> 
                    <div className="fw-medium">{searchError}</div>
                 </div>
              )}

              {searchedWeather && !searchLoading && !searchError && (
                 <div className="mt-5 animation-fade-in text-start">
                    <h5 className="fw-bold mb-4 ms-2 text-dark"><i className="ri-radar-fill text-warning me-2"></i>Live Result</h5>
                    <HeroWeatherCard city={searchedWeather.city} data={searchedWeather.data} />
                 </div>
              )}
            </Col>
          </Row>

          <Row className="mt-5 pt-3">
            <Col lg="12" className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <h2 className="fw-bolder mb-1">Explore Indian Regions</h2>
                <p className="text-muted mb-0">Live climate tracking across all 29 major states</p>
              </div>
              <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-medium">
                 <i className="ri-loop-right-line me-2"></i> Auto-Updating
              </div>
            </Col>
            
            {indianStates.map((state, index) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={index}>
                <WeatherCard 
                  city={state} 
                  loading={statesWeather[state]?.loading} 
                  error={statesWeather[state]?.error} 
                  data={statesWeather[state]?.data} 
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Weather;
