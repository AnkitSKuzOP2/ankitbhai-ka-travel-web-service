import React, { useState, useContext, useEffect } from "react";
import "./booking.css";
import { Form, FormGroup, ListGroup, ListGroupItem, Button, Spinner } from "reactstrap";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";

const Booking = ({ tour, avgRating }) => {
  const { price, reviews, title } = tour;
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState({
    userId: user && user._id,
    userEmail: user && user.email,
    tourName: title,
    fullName: "",
    phone: "",
    guestSize: 1,
    bookAt: "",
  });

  const [isChecking, setIsChecking] = useState(false);
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 20) + 5);
  }, [tour]);

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = 10;
  const totalAmount =
    Number(price) * Number(booking.guestSize) + Number(serviceFee);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      if (!user || user === undefined || user === null) {
        return alert("Please sign in");
      }
      
      if (new Date(booking.bookAt) < new Date(minDate)) {
        return alert("Booking date must be from tomorrow onwards.");
      }

      setIsChecking(true);
      // Simulate real-time checking
      await new Promise(res => setTimeout(res, 2000));
      setIsChecking(false);

      const bookingPayload = { ...booking, totalAmount };
      const res = await fetch(`${BASE_URL}/booking`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingPayload),
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }
      navigate("/thank-you");
    } catch (error) {
      setIsChecking(false);
      alert(error.message);
    }
  };

  return (
    <div className="booking position-relative">
      {isChecking && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white" style={{ zIndex: 10, opacity: 0.95, borderRadius: '8px' }}>
          <Spinner color="warning" style={{ width: '3rem', height: '3rem' }} />
          <h5 className="mt-3 fw-bold text-dark">Checking live availability...</h5>
          <p className="text-muted">Securing your spot</p>
        </div>
      )}

      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ₹{price} <span>/per person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center">
          <i
            className="ri-star-fill"
            style={{ color: "var(--secondary-color)" }}
          ></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>

      <div className="alert alert-warning py-2 px-3 mt-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', borderRadius: '10px' }}>
        <i className="ri-fire-fill text-danger pulse-animation" style={{ fontSize: '1.2rem' }}></i>
        <strong>{viewers} people</strong> are booking this tour right now!
      </div>

      {/* =============== BOOKING FORM START ============== */}
      <div className="booking__form mt-3">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              pattern="^[a-zA-Z\s]{3,50}$"
              title="Name must be between 3 and 50 characters and contain only letters and spaces"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="tel"
              placeholder="Phone"
              id="phone"
              required
              pattern="^[0-9]{10}$"
              maxLength="10"
              title="Phone number must be exactly 10 digits"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="date"
              placeholder=""
              id="bookAt"
              required
              min={minDate}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Guest"
              id="guestSize"
              required
              min="1"
              max="10"
              title="Maximum 10 guests allowed per booking"
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </div>
      {/* =============== BOOKING FORM END ================ */}

      {/* =============== BOOKING BOTTOM ================ */}
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ₹{price} <i className="ri-close-line"></i> {booking.guestSize} person
            </h5>
            <span> ₹{price * booking.guestSize}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service charge</h5>
            <span>₹{serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>₹{totalAmount}</span>
          </ListGroupItem>
        </ListGroup>

        <Button className="btn primary__btn w-100 mt-4 py-3 shadow rounded-pill fw-bold text-white d-flex justify-content-center align-items-center gap-2" onClick={handleClick} style={{ transition: 'all 0.3s' }}>
          Confirm Real-time Booking <i className="ri-flashy-fill text-warning"></i>
        </Button>
      </div>
    </div>
  );
};

export default Booking;
