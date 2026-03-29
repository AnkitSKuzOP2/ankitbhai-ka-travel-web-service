import React, { useState } from "react";
import "../styles/tour.css";
import { Col, Container, Row, Button, Form } from "reactstrap";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import BookingModal from "../shared/BookingModal";

const HotelCard = ({ hotel }) => {
    const { _id, title, city, photo, price, featured, rating, reviews, amenities, distance } = hotel;
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <Col lg="12" className="mb-4">
            <div className="hotel-premium-card d-flex flex-column flex-md-row shadow-sm bg-white" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                <div className="hotel-img-wrapper position-relative" style={{ flex: '0 0 35%', cursor: 'pointer' }} onClick={() => navigate(`/hotels/${_id}`)}>
                    <img src={photo} alt={title} className="w-100 h-100" style={{ objectFit: 'cover', minHeight: '260px' }} />
                    {featured && (
                        <div className="position-absolute top-0 start-0 m-3 px-3 py-1 bg-dark text-warning rounded-pill shadow" style={{ fontSize: '0.85rem', fontWeight: 600, backdropFilter: 'blur(5px)', background: 'rgba(0,0,0,0.7)' }}>
                            <i className="ri-award-fill me-1"></i> Guest Favorite
                        </div>
                    )}
                    <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 bg-white text-dark rounded-pill shadow-sm fw-bold" style={{ fontSize: '0.85rem' }}>
                         <i className="ri-map-pin-2-fill text-danger me-1"></i> {city}
                    </div>
                </div>

                <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h3 className="fw-bolder text-dark mb-1" style={{ cursor: "pointer" }} onClick={() => navigate(`/hotels/${_id}`)}>{title}</h3>
                            <div className="text-end">
                                <div className="d-flex align-items-center justify-content-end gap-2">
                                    <div className="text-end">
                                        <div className="fw-bold text-dark">{rating >= 4.8 ? "Exceptional" : rating >= 4.5 ? "Superb" : "Very Good"}</div>
                                        <span className="text-muted small">{reviews} verified reviews</span>
                                    </div>
                                    <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded" style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 700, borderTopLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                                        {rating}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-muted mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                            <i className="ri-route-line text-primary border p-1 border-primary border-opacity-25 rounded bg-light"></i> 
                            <span>{distance || "City Center proximity"}</span>
                            <span className="ms-2 badge bg-success bg-opacity-10 text-success"><i className="ri-map-pin-line"></i> Great Location</span>
                        </div>

                        {amenities && (
                            <div className="d-flex flex-wrap gap-2 mb-4 mt-2">
                                {amenities.map((amenity, idx) => (
                                    <span key={idx} className="badge bg-light text-dark border py-2 px-3 fw-medium" style={{ fontSize: '0.8rem' }}>
                                        <i className="ri-check-line text-success me-1"></i> {amenity}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="d-flex align-items-end justify-content-between mt-3 pt-3 border-top border-light">
                        <div>
                            <span className="d-block text-danger fw-bold small mb-1"><i className="ri-timer-flash-line"></i> Limited time offer</span>
                            <div className="d-flex align-items-baseline gap-2">
                                <span className="text-decoration-line-through text-muted small">₹{Math.floor(price * 1.3)}</span>
                                <h2 className="fw-bolder m-0 text-dark">₹{price}</h2>
                            </div>
                            <span className="text-muted small">Includes taxes & fees • per night</span>
                        </div>

                        <button onClick={() => setModalOpen(true)} className="btn btn-warning px-5 py-3 rounded-pill shadow fw-bold text-dark" style={{ transition: 'all 0.3s ease', letterSpacing: '0.5px' }}>
                            Reserve Suite <i className="ri-arrow-right-line ms-2"></i>
                        </button>
                    </div>
                </div>
                <BookingModal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} itemTitle={title} itemPrice={price} type="hotel" />
            </div>
        </Col>
    );
};

const Hotels = () => {
    const [cityQuery, setCityQuery] = useState('');
    const [searchTrigger, setSearchTrigger] = useState('');

    const {
        data: hotelsData,
        loading,
        error,
    } = useFetch(`${BASE_URL}/hotels${searchTrigger ? `?city=${searchTrigger}` : ''}`);

    const hotels = hotelsData || [];

    const searchHandler = (e) => {
        e.preventDefault();
        setSearchTrigger(cityQuery);
    };

    return (
        <div className="hotels-page-wrapper bg-light pb-5">
            {/* Stunning Hero Banner for Hotels */}
            <section className="hotels-hero-banner position-relative text-center text-white" style={{ background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1542314831-c6a4d14d8857?q=80&w=2000&auto=format&fit=crop') center/cover", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg="8">
                            <h1 className="display-4 fw-bolder mb-3" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Refined Stays & <span className="text-warning">Luxury Suites</span></h1>
                            <p className="fs-5 fw-light mx-auto mb-5" style={{ maxWidth: "650px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Discover hand-picked premium accommodations across the globe featuring exclusive amenities and spectacular views.</p>
                            
                            <div className="search-hotel-box p-3 bg-white rounded-pill shadow-lg mx-auto" style={{ maxWidth: "700px" }}>
                                <Form onSubmit={searchHandler} className="d-flex align-items-center">
                                    <div className="flex-grow-1 position-relative px-3 border-end">
                                         <i className="ri-map-pin-2-fill text-danger position-absolute" style={{ left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "1.3rem" }}></i>
                                         <input 
                                            type="text" 
                                            placeholder="Where are you traveling next?" 
                                            className="form-control border-0 shadow-none fw-medium text-dark"
                                            style={{ paddingLeft: "40px", fontSize: "1.1rem" }}
                                            value={cityQuery}
                                            onChange={(e) => setCityQuery(e.target.value)}
                                         />
                                    </div>
                                    <div className="px-3 position-relative border-end d-none d-md-block">
                                        <div className="text-muted small fw-bold text-uppercase"><i className="ri-calendar-event-line"></i> Dates</div>
                                        <div className="fw-medium text-dark">Add dates</div>
                                    </div>
                                    <div className="px-3 position-relative d-none d-md-block me-2">
                                        <div className="text-muted small fw-bold text-uppercase"><i className="ri-user-line"></i> Guests</div>
                                        <div className="fw-medium text-dark">2 Adults</div>
                                    </div>
                                    <Button type="submit" className="btn btn-warning rounded-pill fw-bold text-dark px-4 py-3 border-0 shadow-sm" style={{ letterSpacing: "1px" }}>
                                        Search
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="pt-5 mt-2">
                <Container>
                    <div className="d-flex justify-content-between align-items-end mb-5">
                       <div>
                           <h2 className="fw-bolder mb-1 text-dark">Exclusive Properties</h2>
                           <p className="text-muted mb-0 fs-5">{searchTrigger ? `Showing results for "${searchTrigger}"` : `Top featured destinations for you`}</p>
                       </div>
                    </div>

                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <h4 className="mt-4 text-muted">Curating Luxury Stays...</h4>
                        </div>
                    )}
                    
                    {error && (
                        <div className="alert alert-danger p-4 rounded-4 shadow-sm text-center">
                            <i className="ri-error-warning-fill fs-1"></i>
                            <h4 className="mt-2 text-dark">{error}</h4>
                        </div>
                    )}
                    
                    {!loading && !error && (
                        <Row>
                            {hotels?.length === 0 ? (
                                <Col lg="12" className="text-center py-5 bg-white rounded-4 shadow-sm border">
                                    <i className="ri-hotel-bed-line text-muted mb-3" style={{ fontSize: '5rem' }}></i>
                                    <h3 className="fw-bold text-dark">No premium stays found.</h3>
                                    <p className="text-muted fs-5">Try relaxing your search criteria or exploring another luxury destination.</p>
                                </Col>
                            ) : (
                                hotels?.map((hotel) => (
                                    <HotelCard hotel={hotel} key={hotel._id} />
                                ))
                            )}
                        </Row>
                    )}
                </Container>
            </section>
        </div>
    );
};

export default Hotels;
