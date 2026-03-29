import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import './dashboard.css'; // Inheriting modern dashboard styles
import userIcon from '../assets/images/user.png';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  // Dummy wishlist data (replace with real API data)
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'The Golden Circle, Iceland', image: '/tour-images/tour-img01.jpg', price: 120 },
    { id: 2, name: 'Machu Picchu Adventure', image: '/tour-images/tour-img02.jpg', price: 450 },
    { id: 3, name: 'Santorini Sunset Cruise', image: '/tour-images/tour-img03.jpg', price: 85 },
  ]);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
    // TODO: Remove from backend
  };

  if (!user) {
    return <div className="text-center mt-5 pt-5"><h4>Please login to view your wishlist.</h4></div>;
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
                <Link to="/reviews"><i className="ri-star-smile-line"></i> Reviews</Link>
                <Link to="/wishlist"><i className="ri-heart-fill"></i> Wishlist</Link>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg="9" md="8">
            <div className="dashboard-card mb-4 pb-4">
              <h4 className="fw-bold mb-4">Saved Wishlists</h4>

              {wishlist.length === 0 ? (
                <div className="text-center py-5">
                  <i className="ri-heart-add-line text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                  <h5>Your wishlist is empty.</h5>
                  <p className="text-muted mb-4">Start exploring and save your favorite tours for later!</p>
                  <Link to="/tours" className="btn primary__btn text-white px-4">Explore Tours</Link>
                </div>
              ) : (
                <Row className="g-4">
                  {wishlist.map((item) => (
                    <Col lg="4" md="6" sm="6" key={item.id}>
                      <div className="card border-0 shadow-sm h-100 position-relative" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div className="position-absolute top-0 end-0 p-2 z-1">
                          <button
                            className="btn btn-light bg-white rounded-circle shadow-sm"
                            onClick={() => handleRemove(item.id)}
                            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Remove from wishlist"
                          >
                            <i className="ri-delete-bin-line text-danger"></i>
                          </button>
                        </div>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = '/tour-images/tour-img01.jpg'; }}
                        />
                        <div className="card-body">
                          <h6 className="card-title fw-bold text-truncate">{item.name}</h6>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <h5 className="text-warning m-0 fw-bold">₹{item.price}</h5>
                            <Link to={`/tours/${item.id}`} className="btn btn-sm btn-outline-dark px-3 rounded-pill">
                              View Tour
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Wishlist;
