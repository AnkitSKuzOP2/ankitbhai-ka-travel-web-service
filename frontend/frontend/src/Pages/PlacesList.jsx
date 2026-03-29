import React, { useState, useEffect, useRef } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tour.css";
import "../styles/places-search.css";
import TourCard from "./../shared/TourCard";
import Newsletter from "./../shared/Newsletter";
import BookingModal from "../shared/BookingModal";
import { Col, Container, Row } from "reactstrap";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";

const PlaceCardImages = ({ place }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const fetchImages = async () => {
            try {
                // Main Google Places Photo
                const googlePhoto = place.photos && place.photos[0]?.photo_reference
                    ? `${BASE_URL}/places/photo?photo_reference=${place.photos[0].photo_reference}&maxwidth=400`
                    : null;

                // Fetch extra photos via Wikipedia API based on place name
                const wikiRes = await fetch(
                    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(place.name)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`
                );
                const wikiData = await wikiRes.json();

                let fetchedImages = [];
                if (googlePhoto) fetchedImages.push(googlePhoto);

                if (wikiData.query && wikiData.query.pages) {
                    Object.values(wikiData.query.pages).forEach((p) => {
                        if (p.imageinfo && p.imageinfo[0]?.thumburl) {
                            fetchedImages.push(p.imageinfo[0].thumburl);
                        } else if (p.imageinfo && p.imageinfo[0]?.url) {
                            fetchedImages.push(p.imageinfo[0].url);
                        }
                    });
                }

                // Dedup and take up to 5
                fetchedImages = [...new Set(fetchedImages)].slice(0, 5);

                const fallbackUrl = `https://loremflickr.com/400/260/${encodeURIComponent(place.name.split(" ")[0] || "travel")}?lock=1`;

                if (fetchedImages.length === 0) {
                    fetchedImages.push(fallbackUrl);
                }
                
                if (isMounted) setImages(fetchedImages);
            } catch (err) {
                console.error("Error fetching place images:", err);
                const fallbackUrl = place.photos && place.photos[0]?.photo_reference
                    ? `${BASE_URL}/places/photo?photo_reference=${place.photos[0].photo_reference}&maxwidth=400`
                    : `https://loremflickr.com/400/260/${encodeURIComponent(place.name.split(" ")[0] || "travel")}?lock=1`;
                if (isMounted) setImages([fallbackUrl]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchImages();
        return () => { isMounted = false; };
    }, [place]);

    return (
        <div className="place-card__img-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="place-card__img">
                {loading ? (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: "260px", background: "#f5f5f5", color: "#888" }}>
                        Loading images...
                    </div>
                ) : (
                    <img
                        src={images[mainImageIndex] || images[0]}
                        alt={place.name}
                        style={{ height: "260px", width: "100%", objectFit: "cover" }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://loremflickr.com/400/260/city?lock=${place.place_id}`;
                        }}
                    />
                )}
                {place.rating && (
                    <span className="place-card__rating">
                        <i className="ri-star-fill"></i> {place.rating}
                    </span>
                )}
            </div>

            {/* Thumbnail reference gallery (4 to 5 images) */}
            {!loading && images.length > 1 && (
                <div style={{ display: "flex", gap: "8px", padding: "10px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #eee" }}>
                    {images.map((imgUrl, idx) => (
                        <div key={idx} style={{ flexShrink: 0, width: "65px", height: "45px", cursor: "pointer", borderRadius: "5px", overflow: "hidden", border: mainImageIndex === idx ? "2px solid #faa935" : "2px solid transparent", transition: '0.3s' }} onClick={() => setMainImageIndex(idx)}>
                            <img
                                src={imgUrl}
                                alt={`${place.name} ref ${idx}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => e.target.style.display = "none"}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PlacesList = () => {
    const [bookingTarget, setBookingTarget] = useState(null);
    /* ── DB Tours (paginated) ── */
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const { data: tours, loading, error } = useFetch(`${BASE_URL}/tours?page=${page}`);
    const { data: tourCount } = useFetch(`${BASE_URL}/tours/search/getTourCount`);

    useEffect(() => {
        const pages = Math.ceil(tourCount / 8);
        setPageCount(pages);
        window.scrollTo(0, 0);
    }, [page, tourCount, tours]);

    /* ── Google Places city search ── */
    const cityInputRef = useRef("");
    const [gPlaces, setGPlaces] = useState([]);
    const [gLoading, setGLoading] = useState(false);
    const [gError, setGError] = useState("");
    const [searched, setSearched] = useState(false);

    const handleCitySearch = async (e) => {
        e.preventDefault();
        const query = cityInputRef.current.value.trim();
        if (!query) return alert("Please enter a city name");

        setGLoading(true);
        setGError("");
        setGPlaces([]);
        setSearched(true);

        try {
            const res = await fetch(
                `${BASE_URL}/places/textsearch?query=${encodeURIComponent(query + " tourist attractions")}`
            );
            const result = await res.json();

            if (!res.ok) {
                setGError(result.message || "Search failed");
            } else if (!result.results || result.results.length === 0) {
                setGError("No places found for that city. Try another search.");
            } else {
                setGPlaces(result.results.slice(0, 12));
            }
        } catch {
            setGError("Unable to reach the Places service. Make sure the backend is running.");
        } finally {
            setGLoading(false);
        }
    };

    // Replaced generic Unsplash image fallback with multi-image PlaceCardImages component

    return (
        <>
            <CommonSection title={"Explore Places"} />

            {/* ── Google Places City Search Section ── */}
            <section className="places-search-section">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center mb-4">
                            <h2 className="places-search-title">
                                <i className="ri-search-eye-line"></i> Discover Places in Any City
                            </h2>
                            <p className="places-search-subtitle">
                                Search real tourist attractions, landmarks, and hidden gems using Google Places
                            </p>
                        </Col>
                        <Col lg="8" className="mx-auto">
                            <form className="city-search-form" onSubmit={handleCitySearch}>
                                <div className="city-search-input-wrap">
                                    <i className="ri-map-pin-2-line"></i>
                                    <input
                                        type="text"
                                        placeholder="Enter city name (e.g. Mumbai, Goa, Jaipur...)"
                                        ref={cityInputRef}
                                    />
                                </div>
                                <button className="btn btn-primary city-search-btn" type="submit">
                                    <i className="ri-search-line"></i> Search Places
                                </button>
                            </form>
                        </Col>
                    </Row>

                    {/* Google Places Results */}
                    {gLoading && (
                        <Row className="mt-4">
                            <Col className="text-center">
                                <div className="places-loading">
                                    <i className="ri-loader-4-line spinning"></i>
                                    <span>Searching places...</span>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {gError && (
                        <Row className="mt-3">
                            <Col lg="8" className="mx-auto">
                                <div className="places-error-msg">
                                    <i className="ri-error-warning-line"></i> {gError}
                                    {gError.toLowerCase().includes("google") && (
                                        <span className="text-muted ms-2 d-block mt-1" style={{ fontSize: "0.85rem" }}>
                                            (Google API key may not be configured. Contact the site admin.)
                                        </span>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    )}

                    {!gLoading && gPlaces.length > 0 && (
                        <>
                            <Row className="mt-4 mb-2">
                                <Col lg="12">
                                    <h5 className="places-results-heading">
                                        <i className="ri-map-pin-line text-warning"></i> Found {gPlaces.length} places
                                    </h5>
                                </Col>
                            </Row>
                            <Row>
                                {gPlaces.map((place) => (
                                    <Col lg="3" md="4" sm="6" xs="12" className="mb-4" key={place.place_id}>
                                        <div className="place-card">
                                            <PlaceCardImages place={place} />
                                            <div className="place-card__content">
                                                <h6 className="place-card__name">{place.name}</h6>
                                                <p className="place-card__address">
                                                    <i className="ri-map-pin-line"></i>{" "}
                                                    {place.formatted_address || place.vicinity}
                                                </p>
                                                {place.types && place.types.length > 0 && (
                                                    <span className="place-card__type">
                                                        {place.types[0].replace(/_/g, " ")}
                                                    </span>
                                                )}
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                        place.name + " " + (place.formatted_address || "")
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm place-card__btn"
                                                >
                                                    <i className="ri-map-2-line"></i> View Map
                                                </a>
                                                <button 
                                                    onClick={() => setBookingTarget(place)} 
                                                    className="btn btn-sm btn-dark ms-2 shadow-sm rounded-pill"
                                                    style={{ fontSize:"0.8rem", padding: "0.4rem 1rem"}}
                                                >
                                                    Book Visit
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            {bookingTarget && (
                                <BookingModal 
                                    isOpen={!!bookingTarget} 
                                    toggle={() => setBookingTarget(null)} 
                                    itemTitle={bookingTarget.name} 
                                    itemPrice={45} 
                                    type="tour" 
                                />
                            )}
                        </>
                    )}

                    {!gLoading && searched && gPlaces.length === 0 && !gError && (
                        <Row className="mt-3">
                            <Col className="text-center">
                                <p className="text-muted">No places found. Try a different city name.</p>
                            </Col>
                        </Row>
                    )}
                </Container>
            </section>

            {/* ── Divider ── */}
            <div className="places-section-divider">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center">
                            <h4 className="divider-heading">
                                <i className="ri-suitcase-2-line"></i> Browse Our Tour Packages
                            </h4>
                            <p className="divider-sub">Handpicked tours with expert guides and best prices</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* ── Existing DB Tour Listing ── */}
            <section className="pt-0">
                <Container>
                    {loading && <h4 className="text-center pt-5">LOADING..........</h4>}
                    {error && <h4 className="text-center pt-5">{error}</h4>}
                    {!loading && !error && (
                        <Row>
                            {tours?.map((tour) => (
                                <Col lg="3" md="6" sm="6" xs="12" className="mb-4" key={tour._id}>
                                    <TourCard tour={tour} />
                                </Col>
                            ))}

                            <Col lg="12">
                                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                                    {[...Array(pageCount).keys()].map((number) => (
                                        <span
                                            key={number}
                                            onClick={() => setPage(number)}
                                            className={page === number ? "active__page" : ""}
                                        >
                                            {number + 1}
                                        </span>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </section>
            <Newsletter />
        </>
    );
};

export default PlacesList;
