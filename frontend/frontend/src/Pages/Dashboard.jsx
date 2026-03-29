import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import useFetch from '../hooks/useFetch';
import './dashboard.css';
import userIcon from '../assets/images/user.png';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookingCount, setBookingCount] = useState(0);

  // Load featured tours from real API for "Popular Places"
  const { data: featuredTours, loading: toursLoading } = useFetch(
    `${BASE_URL}/tours/search/getFeaturedTours`
  );

  // Load user's bookings count
  useEffect(() => {
    if (!user?._id) return;
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/booking/user/${user._id}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const result = await res.json();
          setBookingCount(result.data?.length || 0);
        }
      } catch {
        // silently ignore — user may not have bookings
      }
    };
    fetchBookings();
  }, [user]);

  const stats = {
    totalBookings: bookingCount,
    wishlist: 0,
    reviews: 0,
    notifications: 0,
  };

  return (
    <section className="dashboard-section">
      <Container>
        <Row>
          {/* Sidebar */}
          <Col lg="3" md="4" className="mb-4">
            <div className="dashboard-card text-center dashboard-user">
              <img src={user?.photo || userIcon} alt="user" className="w-50 rounded-circle mb-3 border border-3 border-light shadow-sm" style={{ objectFit: 'cover', height: '120px', width: '120px' }} />
              <h4>{user?.username || 'Traveler'}</h4>
              <p>{user?.email || 'Welcome to TravelWorld'}</p>

              <div className="dashboard-menu mt-4">
                <Link to="/dashboard"><i className="ri-dashboard-line"></i> Dashboard</Link>
                <Link to="/profile"><i className="ri-user-settings-line"></i> My Profile</Link>
                <Link to="/bookings"><i className="ri-suitcase-line"></i> My Bookings</Link>
                <Link to="/reviews"><i className="ri-star-smile-line"></i> Reviews</Link>
                <Link to="/wishlist"><i className="ri-heart-line"></i> Wishlist</Link>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg="9" md="8">
            <div className="dashboard-card mb-4">
              <h4 className="mb-4 fw-bold">Dashboard Overview</h4>
              <Row>
                <Col lg="6" sm="6" xs="12" className="mb-3">
                  <div className="stat-card">
                    <div className="stat-icon"><i className="ri-calendar-check-line"></i></div>
                    <div className="stat-info">
                      <h3>{stats.totalBookings}</h3>
                      <p>Total Bookings</p>
                    </div>
                  </div>
                </Col>
                <Col lg="6" sm="6" xs="12" className="mb-3">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(238, 110, 110, 0.15)', color: '#ee6e6e' }}><i className="ri-heart-3-line"></i></div>
                    <div className="stat-info">
                      <h3>{stats.wishlist}</h3>
                      <p>Wishlist</p>
                    </div>
                  </div>
                </Col>
                <Col lg="6" sm="6" xs="12" className="mb-3">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(40, 167, 69, 0.15)', color: '#28a745' }}><i className="ri-star-half-line"></i></div>
                    <div className="stat-info">
                      <h3>{stats.reviews}</h3>
                      <p>Reviews Given</p>
                    </div>
                  </div>
                </Col>
                <Col lg="6" sm="6" xs="12" className="mb-3">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(23, 162, 184, 0.15)', color: '#17a2b8' }}><i className="ri-notification-3-line"></i></div>
                    <div className="stat-info">
                      <h3>{stats.notifications}</h3>
                      <p>Notifications</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="dashboard-card pt-4 pb-2">
              <h5 className="mb-4 fw-bold"><i className="ri-fire-line text-warning"></i> Recommended For You</h5>
              <Row>
                {toursLoading && <p className="text-center w-100">Loading recommendations...</p>}
                {!toursLoading && Array.isArray(featuredTours) && featuredTours.length > 0
                  ? featuredTours.slice(0, 4).map((tour) => (
                    <Col lg="3" md="6" xs="6" className="mb-3" key={tour._id}>
                      <Link to={`/tours/${tour._id}`} className="dashboard-place-card">
                        <img
                          src={
                            tour.photo && tour.photo.startsWith('http')
                              ? tour.photo
                              : '/tour-images/tour-img01.jpg'
                          }
                          alt={tour.title}
                          className="dashboard-place-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/tour-images/tour-img01.jpg';
                          }}
                        />
                        <div className="dashboard-place-title">{tour.title}</div>
                      </Link>
                    </Col>
                  ))
                  : !toursLoading && (
                    <p className="text-muted w-100 text-center">No featured tours available yet.</p>
                  )}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
