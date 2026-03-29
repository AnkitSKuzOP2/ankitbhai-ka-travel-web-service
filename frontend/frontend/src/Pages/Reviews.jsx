import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import './dashboard.css'; // Inheriting modern dashboard styles
import userIcon from '../assets/images/user.png';

const Reviews = () => {
  const { user } = useContext(AuthContext);
  // Dummy reviews data (replace with real API data)
  const [reviews, setReviews] = useState([
    { id: 1, tour: 'Paris Tour', rating: 5, comment: 'Amazing experience! Highly recommended.', date: '2026-02-10' },
    { id: 2, tour: 'London Adventure', rating: 4, comment: 'Great guide and fun trip.', date: '2026-01-15' },
  ]);
  const [newReview, setNewReview] = useState({ tour: '', rating: 5, comment: '' });

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([
      { ...newReview, id: Date.now(), date: new Date().toISOString().slice(0, 10) },
      ...reviews,
    ]);
    setNewReview({ tour: '', rating: 5, comment: '' });
    // TODO: Send to backend
  };

  if (!user) {
    return <div className="text-center mt-5 pt-5"><h4>Please login to view your reviews.</h4></div>;
  }

  return (
    <section className="dashboard-section">
      <Container>
        <Row>
          {/* Sidebar */}
          <Col lg="3" md="4" className="mb-4">
            <div className="dashboard-card text-center dashboard-user">
              <img
                src={user?.photo || userIcon}
                alt="user"
                className="w-50 rounded-circle mb-3 border border-3 border-light shadow-sm"
                style={{ objectFit: 'cover', height: '120px', width: '120px' }}
              />
              <h4>{user?.username || 'Traveler'}</h4>
              <p>{user?.email || 'Welcome to TravelWorld'}</p>

              <div className="dashboard-menu mt-4">
                <Link to="/dashboard"><i className="ri-dashboard-line"></i> Dashboard</Link>
                <Link to="/profile"><i className="ri-user-settings-line"></i> My Profile</Link>
                <Link to="/bookings"><i className="ri-suitcase-line"></i> My Bookings</Link>
                <Link to="/reviews"><i className="ri-star-smile-fill"></i> Reviews</Link>
                <Link to="/wishlist"><i className="ri-heart-line"></i> Wishlist</Link>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg="9" md="8">
            <div className="dashboard-card mb-4">
              <h4 className="fw-bold mb-4">Leave a Review</h4>

              <Form onSubmit={handleSubmit} className="border-bottom pb-4 mb-4">
                <Row>
                  <Col md="8">
                    <FormGroup>
                      <input
                        className="form-control p-3 bg-light border-0 rounded-3"
                        name="tour"
                        value={newReview.tour}
                        onChange={handleChange}
                        placeholder="Tour Name"
                        required
                        pattern="^[a-zA-Z0-9\s.,!?-]{3,100}$"
                        title="Please provide a valid tour name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <select
                        className="form-select p-3 bg-light border-0 rounded-3"
                        name="rating"
                        value={newReview.rating}
                        onChange={handleChange}
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Star{r > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <textarea
                        className="form-control p-3 bg-light border-0 rounded-3"
                        name="comment"
                        value={newReview.comment}
                        onChange={handleChange}
                        placeholder="Share your experience..."
                        rows="4"
                        required
                        minLength="5"
                        maxLength="500"
                        title="Review must be between 5 and 500 characters"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <Button type="submit" className="btn primary__btn text-white px-4">
                      Submit Review
                    </Button>
                  </Col>
                </Row>
              </Form>

              <h4 className="fw-bold mb-4">My Past Reviews</h4>
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="text-muted text-center my-4">No reviews yet. Share your first experience above!</p>
                ) : (
                  reviews.map((r) => (
                    <div className="p-4 mb-3 border rounded-3 bg-light shadow-sm d-flex gap-3" key={r.id}>
                      <div className="d-none d-sm-block">
                        <img src={user?.photo || userIcon} className="rounded-circle" width="50" height="50" alt="user" style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="fs-5">{r.tour}</strong>
                          <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {new Date(r.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="text-warning mb-2" style={{ letterSpacing: '2px' }}>
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        </div>
                        <p className="text-muted m-0">{r.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Reviews;
