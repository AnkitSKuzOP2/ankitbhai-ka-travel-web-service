import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Table, Card, CardBody, CardTitle } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import './adminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/home');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users`, {
          credentials: 'include',
        });
        if (res.ok) {
          const result = await res.json();
          setUsers(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/booking`, {
          credentials: 'include',
        });
        if (res.ok) {
          const result = await res.json();
          setBookings(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchUsers();
    fetchBookings();
  }, [user, navigate]);

  return (
    <section className="admin-dashboard-section">
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <h2 className="fw-bold text-center">Admin Dashboard</h2>
            <p className="text-center text-muted">Manage all users, bookings, and platform info</p>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col lg="6" sm="6" className="mb-3">
            <Card className="shadow-sm border-0 stat-card" onClick={() => setActiveTab('users')} style={{ cursor: 'pointer', background: activeTab === 'users' ? 'var(--bg-color)' : 'var(--card-bg)' }}>
              <CardBody className="text-center p-4">
                <i className="ri-group-line fs-1 text-primary mb-2 d-block"></i>
                <CardTitle tag="h4">{users.length}</CardTitle>
                <p className="text-muted mb-0">Total Registered Users</p>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" sm="6" className="mb-3">
            <Card className="shadow-sm border-0 stat-card" onClick={() => setActiveTab('bookings')} style={{ cursor: 'pointer', background: activeTab === 'bookings' ? 'var(--bg-color)' : 'var(--card-bg)' }}>
              <CardBody className="text-center p-4">
                <i className="ri-calendar-check-line fs-1 text-success mb-2 d-block"></i>
                <CardTitle tag="h4">{bookings.length}</CardTitle>
                <p className="text-muted mb-0">Total Travel Bookings</p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <div className="admin-dashboard-card bg-white p-4 rounded shadow-sm border-0">
              <h4 className="mb-4 fw-bold pb-2 border-bottom">
                {activeTab === 'users' ? 'All User Information' : 'All Booking Information'}
              </h4>
              
              {activeTab === 'users' && (
                <div className="table-responsive" style={{ whiteSpace: 'nowrap' }}>
                  {loadingUsers ? (
                    <p className="text-center py-4">Loading users...</p>
                  ) : (
                    <Table hover className="align-middle table-bordered text-center">
                      <thead className="table-dark">
                        <tr>
                          <th>Photo</th>
                          <th>Full Name</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Gender</th>
                          <th>City/Country</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users && users.length > 0 ? (
                          users.map((u) => (
                            <tr key={u._id}>
                              <td>
                                <img src={u.photo || 'https://via.placeholder.com/40'} alt="user" className="rounded-circle" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
                              </td>
                              <td className="fw-bold">{u.firstName ? `${u.firstName} ${u.lastName || ''}` : 'N/A'}</td>
                              <td className="text-primary">{u.username}</td>
                              <td>{u.email}</td>
                              <td>{u.mobile || 'N/A'}</td>
                              <td>{u.gender || 'N/A'}</td>
                              <td>{u.city ? `${u.city}, ${u.country || ''}` : 'N/A'}</td>
                              <td>
                                <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="text-muted small">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="9" className="text-center py-4">No users found in database.</td></tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="table-responsive">
                  {loadingBookings ? (
                    <p className="text-center">Loading bookings...</p>
                  ) : (
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Booking ID</th>
                          <th>User Details</th>
                          <th>Tour / Place</th>
                          <th>Date</th>
                          <th>Guest Size</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings && bookings.length > 0 ? (
                          bookings.map((b) => (
                            <tr key={b._id}>
                              <td className="text-muted small">{b._id}</td>
                              <td>
                                <div><strong>{b.fullName}</strong></div>
                                <div className="text-muted small">{b.userEmail}</div>
                                <div className="text-muted small">☎ {b.phone}</div>
                              </td>
                              <td className="fw-bold">{b.tourName}</td>
                              <td>{new Date(b.bookAt).toLocaleDateString()}</td>
                              <td className="text-center">{b.guestSize}</td>
                              <td className="text-success fw-bold">
                                {b.totalAmount ? `₹${b.totalAmount}` : 'N/A'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="6" className="text-center">No bookings found.</td></tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminDashboard;
