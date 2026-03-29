import React, { useState } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tour.css";
import { Col, Container, Row } from "reactstrap";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import BookingModal from "../shared/BookingModal";

const GuideCard = ({ guide }) => {
    const { name, languages, rating, pricePerDay, city } = guide;
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Col lg="4" md="6" sm="6" xs="12" className="mb-4">
            <div className="dashboard-place-card h-100 position-relative p-0 text-start" style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="position-relative text-center bg-light pt-4 pb-3">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`}
                        alt={name}
                        className="rounded-circle shadow-sm border border-4 border-white mb-2"
                        style={{ height: '110px', width: '110px', objectFit: 'cover' }}
                    />
                    <div className="w-100 px-4 mt-2 d-flex justify-content-between align-items-center">
                        <span className="badge bg-dark rounded-pill shadow-sm"><i className="ri-user-star-fill text-warning"></i> Local Expert</span>
                        <span className="text-warning bg-white px-2 py-1 rounded shadow-sm fw-bold border" style={{ fontSize: '0.9rem' }}><i className="ri-star-s-fill"></i> {rating}</span>
                    </div>
                </div>

                <div className="p-4">
                    <h4 className="mb-1 fw-bold text-dark">{name}</h4>
                    <span className="text-muted d-block mb-3" style={{ fontSize: '0.95rem' }}>
                        <i className="ri-map-pin-2-fill text-danger fs-5 align-middle"></i> Operating in {city}
                    </span>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                        {languages.map((lang) => (
                            <span key={lang} className="px-3 py-1 bg-light text-dark rounded-pill border" style={{ fontSize: '0.85rem' }}>
                                <i className="ri-translate-2 text-primary"></i> {lang}
                            </span>
                        ))}
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                        <div className="pt-1">
                            <h4 className="fw-bolder m-0 d-inline text-dark">₹{pricePerDay}</h4>
                            <span className="text-muted fw-normal"> /day</span>
                        </div>

                        <button className="btn btn-warning px-4 py-2 rounded-pill shadow-sm fw-bold border border-warning" onClick={() => setModalOpen(true)} style={{ transition: '0.3s' }}>
                            Hire Guide <i className="ri-arrow-right-line ms-1"></i>
                        </button>
                    </div>
                </div>
                <BookingModal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} itemTitle={name} itemPrice={pricePerDay} type="guide" />
            </div>
        </Col>
    );
};

const Guides = () => {
    const [cityQuery, setCityQuery] = useState('');
    const [searchTrigger, setSearchTrigger] = useState('');

    const {
        data: guidesData,
        loading,
        error,
    } = useFetch(`${BASE_URL}/guides${searchTrigger ? `?city=${searchTrigger}` : ''}`);

    const guides = guidesData || [];

    const searchHandler = () => {
        setSearchTrigger(cityQuery);
    };

    return (
        <>
            <CommonSection title={"Find a Local Tour Guide"} />
            <section>
                <Container>
                    <Row>
                        {/* Simple Searchbar for Guides */}
                        <Col lg="12">
                            <div className="search__bar d-flex align-items-center p-3 mb-5 border rounded-pill shadow-sm bg-white" style={{ maxWidth: "600px", margin: "0 auto" }}>
                                <div className="d-flex align-items-center gap-3 w-100 px-3">
                                    <span><i className="ri-user-star-line text-warning fs-4"></i></span>
                                    <div className="flex-grow-1">
                                        <input
                                            type="text"
                                            placeholder="Which city do you need a guide in?"
                                            className="border-0 w-100"
                                            style={{ outline: "none" }}
                                            value={cityQuery}
                                            onChange={(e) => setCityQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') searchHandler();
                                            }}
                                        />
                                    </div>
                                    <span className="search__icon bg-warning rounded-circle d-flex align-items-center justify-content-center" style={{ cursor: "pointer", width: "40px", height: "40px" }} onClick={searchHandler}>
                                        <i className="ri-search-line text-white"></i>
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="pt-0">
                <Container>
                    {loading && <h4 className="text-center pt-5">Loading available guides...</h4>}
                    {error && <h4 className="text-center pt-5 text-danger">{error}</h4>}
                    {!loading && !error && (
                        <Row>
                            {guides?.length === 0 ? (
                                <Col lg="12" className="text-center py-5">
                                    <i className="ri-group-line text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                                    <h4 className="text-muted">No verified guides available in this city right now.</h4>
                                    <p className="text-muted">Search for nearby locations to find our top experts.</p>
                                </Col>
                            ) : (
                                guides?.map((guide) => (
                                    <GuideCard guide={guide} key={guide.id} />
                                ))
                            )}
                        </Row>
                    )}
                </Container>
            </section>
        </>
    );
};

export default Guides;
