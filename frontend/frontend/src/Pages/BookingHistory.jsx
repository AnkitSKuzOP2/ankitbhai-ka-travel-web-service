import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Table } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import './dashboard.css'; // Inheriting modern dashboard styles
import userIcon from '../assets/images/user.png';

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/booking/user/${user._id}`, {
          credentials: 'include',
        });
        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message || 'Failed to fetch bookings');
        }
        const result = await res.json();
        setBookings(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return <div className="text-center mt-5 pt-5"><h4>Please login to view your booking history.</h4></div>;
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
                <Link to="/bookings"><i className="ri-suitcase-fill"></i> My Bookings</Link>
                <Link to="/reviews"><i className="ri-star-smile-line"></i> Reviews</Link>
                <Link to="/wishlist"><i className="ri-heart-line"></i> Wishlist</Link>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg="9" md="8">
            <div className="dashboard-card mb-4 pb-4">
              <h4 className="fw-bold mb-4">My Booking History</h4>

              {loading && <p className="text-center mt-4">Loading your bookings...</p>}
              {error && <div className="alert alert-danger">{error}</div>}

              {!loading && !error && bookings.length === 0 && (
                <div className="text-center py-5">
                  <i className="ri-suitcase-3-line text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                  <h5>No bookings found yet.</h5>
                  <p className="text-muted mb-4">You haven't booked any tours. It's time to start planning your next adventure!</p>
                  <Link to="/tours" className="btn primary__btn text-white px-4">Browse Tours</Link>
                </div>
              )}

              {!loading && !error && bookings.length > 0 && (
                <div className="table-responsive">
                  <Table hover borderless className="align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3">Tour Name</th>
                        <th className="py-3">Travel Date</th>
                        <th className="py-3">Guests</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id} className="border-bottom">
                          <td className="py-3 fw-bold">{b.tourName}</td>
                          <td className="py-3 text-muted">
                            <i className="ri-calendar-event-line me-1"></i>
                            {new Date(b.bookAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-3 text-muted">
                            <i className="ri-group-line me-1"></i>
                            {b.guestSize}
                          </td>
                          <td className="py-3 fw-bold text-success">
                            ₹{(b.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span className="badge bg-success px-3 py-2 rounded-pill">Confirmed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BookingHistory;
