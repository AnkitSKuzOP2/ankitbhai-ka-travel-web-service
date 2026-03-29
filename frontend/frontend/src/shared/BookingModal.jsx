import React, { useState, useContext, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Button, Spinner } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ isOpen, toggle, itemTitle, itemPrice, type }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    userId: user?._id || null,
    userEmail: user?.email || null,
    tourName: itemTitle || "Reserved Item",
    fullName: "",
    phone: "",
    guestSize: 1,
    bookAt: "",
  });

  const [isChecking, setIsChecking] = useState(false);
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setViewers(Math.floor(Math.random() * 15) + 3);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = type === 'guide' ? 5 : type === 'hotel' ? 15 : 10;
  const totalAmount = Number(itemPrice) * Number(booking.guestSize) + Number(serviceFee);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        return alert("Please sign in to book");
      }
      
      if (new Date(booking.bookAt) < new Date(minDate)) {
        return alert("Booking date must be from tomorrow onwards.");
      }

      setIsChecking(true);
      // Simulate real-time availability check
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      
      toggle();
      navigate("/thank-you");
    } catch (error) {
      setIsChecking(false);
      alert(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Book {type.charAt(0).toUpperCase() + type.slice(1)}: {itemTitle}</ModalHeader>
      <ModalBody className="position-relative">
        {isChecking && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white" style={{ zIndex: 10, opacity: 0.9 }}>
            <Spinner color="warning" style={{ width: '3rem', height: '3rem' }} />
            <h5 className="mt-3 fw-bold text-dark">Checking live availability...</h5>
            <p className="text-muted">Directly connecting to {type} host</p>
          </div>
        )}

        <div className="alert alert-warning py-2 px-3 d-flex align-items-center gap-2 mb-3" style={{ fontSize: '0.9rem', borderRadius: '10px' }}>
          <i className="ri-eye-fill text-danger pulse-animation" style={{ fontSize: '1.2rem' }}></i>
          <strong>{viewers} people</strong> are looking at this {type} right now!
        </div>

        <div className="mt-2 p-3 bg-light rounded shadow-sm" style={{ fontSize: '1.05rem', fontWeight: 500, borderLeft: '4px solid var(--secondary-color)' }}>
          <p className="mb-1 d-flex justify-content-between">
            <span>Base Rate:</span>
            <span>₹{itemPrice} per {type === 'guide' ? 'day' : type === 'hotel' ? 'night' : 'person'}</span>
          </p>
          <p className="mb-1 d-flex justify-content-between">
            <span>Service Fee:</span>
            <span>₹{serviceFee}</span>
          </p>
          <hr className="my-2" />
          <h5 className="text-success d-flex justify-content-between fw-bold m-0">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </h5>
        </div>

        <Form onSubmit={handleSubmit} className="mt-4">
          <FormGroup>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              className="form-control px-3 py-2 shadow-sm border-0"
              style={{ backgroundColor: '#f4f5f9', borderRadius: '10px' }}
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
              className="form-control px-3 py-2 shadow-sm border-0"
              style={{ backgroundColor: '#f4f5f9', borderRadius: '10px' }}
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
              id="bookAt"
              className="form-control px-3 py-2 shadow-sm border-0"
              style={{ backgroundColor: '#f4f5f9', borderRadius: '10px' }}
              required
              min={minDate}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Guests/Days"
              id="guestSize"
              className="form-control px-3 py-2 shadow-sm border-0"
              style={{ backgroundColor: '#f4f5f9', borderRadius: '10px' }}
              min="1"
              max="10"
              title="Maximum 10 guests/days allowed per booking"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <Button color="dark" className="w-100 mt-3 py-3 shadow rounded-pill fw-bold" type="submit" style={{ transition: 'all 0.3s' }}>
            Confirm Real-time Booking <i className="ri-flashy-fill text-warning ms-1"></i>
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default BookingModal;
