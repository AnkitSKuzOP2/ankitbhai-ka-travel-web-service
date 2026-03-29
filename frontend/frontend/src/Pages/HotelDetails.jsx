import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import BookingModal from "../shared/BookingModal";
import "../styles/tour-details.css";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: hotel, loading, error } = useFetch(`${BASE_URL}/hotels/${id}`);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hotel]);

  if (loading) {
    return (
      <Container className="pt-5 text-center mt-5 mb-5" style={{ minHeight: "50vh" }}>
        <Spinner color="warning" style={{ width: "3rem", height: "3rem" }} />
        <h4 className="mt-4 text-muted">Retrieving Hotel Details...</h4>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="pt-5 text-center mt-5 mb-5" style={{ minHeight: "50vh" }}>
        <i className="ri-error-warning-fill text-danger" style={{ fontSize: "4rem" }}></i>
        <h4 className="mt-3">{error}</h4>
        <Button color="warning" className="mt-4 px-4 btn-rounded text-dark fw-bold" onClick={() => navigate('/hotels')}>Go Back</Button>
      </Container>
    );
  }

  if (!hotel) return null;

  const { title, city, price, rating, reviews, desc, amenities, distance, photoGallery, address } = hotel;

  return (
    <section className="pt-4 pb-5 bg-light" style={{ minHeight: "100vh" }}>
      <Container>
        {/* Top Header & Breadcrumb */}
        <div className="d-flex align-items-center mb-4 text-muted" style={{ cursor: "pointer", fontSize: "0.95rem" }} onClick={() => navigate('/hotels')}>
           <i className="ri-arrow-left-line me-2"></i> Back to luxury stays
        </div>

        <Row className="mb-4 align-items-end">
          <Col md="8">
            <h1 className="fw-bolder display-5 mb-2 text-dark">{title}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 text-muted">
               <span className="badge bg-warning bg-opacity-10 text-dark border border-warning px-3 py-2 rounded-pill fw-bold">
                  <i className="ri-star-fill text-warning me-1"></i> {rating >= 4.5 ? "Superb" : "Great"} {rating} ({reviews} Reviews)
               </span>
               <span className="text-primary fw-medium"><i className="ri-map-pin-2-line border p-1 rounded border-primary bg-white me-1"></i> {city}</span>
               <span><i className="ri-road-map-line"></i> {distance}</span>
            </div>
          </Col>
          <Col md="4" className="text-md-end mt-3 mt-md-0">
             <Button color="dark" outline className="rounded-pill px-4 py-2 fw-medium shadow-sm border-2">
                 <i className="ri-share-forward-line me-2"></i> Share
             </Button>
             <Button color="danger" outline className="rounded-pill px-4 py-2 ms-2 fw-medium shadow-sm border-2">
                 <i className="ri-heart-add-line me-2"></i> Save
             </Button>
          </Col>
        </Row>

        {/* Dynamic Masonry Photo Gallery */}
        {photoGallery && photoGallery.length > 0 && (
          <Row className="mb-5 g-3">
             <Col md="8">
                <div className="overflow-hidden rounded-4 shadow-sm h-100" style={{ minHeight: '400px', cursor: 'pointer' }}>
                   <img src={photoGallery[0]} alt="Main property view" className="w-100 h-100 tour__img" style={{ objectFit: 'cover' }} />
                </div>
             </Col>
             <Col md="4">
                <Row className="g-3 h-100">
                    <Col xs="12" className="h-50">
                        <div className="overflow-hidden rounded-4 shadow-sm h-100">
                           <img src={photoGallery[1] || photoGallery[0]} alt="Secondary property view" className="w-100 h-100 tour__img" style={{ objectFit: 'cover' }} />
                        </div>
                    </Col>
                    <Col xs="12" className="h-50 position-relative">
                        <div className="overflow-hidden rounded-4 shadow-sm h-100">
                           <img src={photoGallery[2] || photoGallery[0]} alt="Property feature" className="w-100 h-100 tour__img" style={{ objectFit: 'cover' }} />
                        </div>
                    </Col>
                </Row>
             </Col>
          </Row>
        )}

        {/* Content Section */}
        <Row className="gx-5">
            <Col lg="8">
                <div className="bg-white p-5 rounded-4 shadow-sm mb-5 border border-light">
                   <h3 className="fw-bolder mb-4">About the Property</h3>
                   <p className="text-muted lh-lg fs-5">{desc}</p>
                   
                   <p className="text-dark bg-light p-3 rounded mt-4 border-start border-4 border-warning fw-medium">
                      <i className="ri-building-line me-2"></i> <strong>Official Address: </strong> {address}
                   </p>
                </div>

                <div className="bg-white p-5 rounded-4 shadow-sm mb-4 border border-light">
                   <h3 className="fw-bolder mb-4">Premium Amenities</h3>
                   <Row className="g-4">
                      {amenities?.map((am, i) => (
                         <Col sm="6" md="4" key={i}>
                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 text-dark fw-medium" style={{ transition: 'all 0.2s ease', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.classList.add('shadow-sm')} onMouseOut={(e) => e.currentTarget.classList.remove('shadow-sm')}>
                               <i className="ri-vip-diamond-line text-warning fs-4"></i> {am}
                            </div>
                         </Col>
                      ))}
                   </Row>
                </div>
            </Col>

            <Col lg="4">
                <div className="bg-white p-4 p-md-5 rounded-4 shadow border border-light sticky-top" style={{ top: "100px" }}>
                   <div className="d-flex align-items-baseline gap-2 mb-3">
                      <h2 className="fw-bolder m-0 display-6">₹{price}</h2>
                      <span className="text-muted">/ night</span>
                   </div>
                   
                   <div className="alert alert-success d-flex align-items-center px-3 py-2 mb-4 rounded-3 border-0 bg-success bg-opacity-10 text-success fw-bold">
                       <i className="ri-checkbox-circle-fill me-2 fs-5"></i> Rooms Available
                   </div>

                   <hr className="text-muted opacity-25" />
                   
                   <div className="d-flex justify-content-between text-muted mb-2">
                       <span>Base Suite Rate</span>
                       <span>₹{price}</span>
                   </div>
                   <div className="d-flex justify-content-between text-muted mb-2">
                       <span>Luxury Tax (18%)</span>
                       <span>₹{Math.floor(price * 0.18)}</span>
                   </div>
                   <div className="d-flex justify-content-between text-muted mb-4">
                       <span className="text-decoration-underline text-info" style={{ cursor: 'pointer' }}>Service Fee</span>
                       <span>₹2,500</span>
                   </div>

                   <div className="d-flex justify-content-between fw-bold text-dark fs-5 mb-4 pt-3 border-top">
                       <span>Total estimated</span>
                       <span>₹{price + Math.floor(price * 0.18) + 2500}</span>
                   </div>

                   <Button className="btn btn-warning w-100 rounded-pill py-3 fw-bold shadow-sm" style={{ fontSize: "1.1rem" }} onClick={() => setModalOpen(true)}>
                       Book Now
                   </Button>
                   <p className="text-center text-muted mt-3 mb-0 small"><i className="ri-shield-check-fill text-success"></i> Payment secure & verified</p>
                </div>
            </Col>
        </Row>
        
        <BookingModal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} itemTitle={title} itemPrice={price} type="hotel" />
      </Container>
    </section>
  );
};

export default HotelDetails;
