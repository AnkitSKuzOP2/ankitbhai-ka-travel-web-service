import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import './dashboard.css'; // Inheriting modern dashboard styles
import userIcon from '../assets/images/user.png';

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      setForm({ ...form, profilePic: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm(user);
    setError(null);
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form };
      
      // Convert file photo to Base64 String to send as JSON natively
      if (form.profilePic instanceof File) {
        const base64Str = await toBase64(form.profilePic);
        payload.photo = base64Str;
      }
      
      // Remove File object and token from json payload
      delete payload.profilePic;
      delete payload.token;

      const token = user?.token;
      const res = await fetch(`${BASE_URL}/users/${user?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...data.data, token } });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-5 pt-5"><h4>Please login to view your profile.</h4></div>;

  return (
    <section className="dashboard-section">
      <Container>
        <Row>
          {/* Sidebar */}
          <Col lg="3" md="4" className="mb-4">
            <div className="dashboard-card text-center dashboard-user p-4">
              <img
                src={
                  form.profilePic instanceof File
                    ? URL.createObjectURL(form.profilePic)
                    : user?.photo || userIcon
                }
                alt="user"
                className="w-50 rounded-circle mb-3 border border-3 border-light shadow-sm"
                style={{ objectFit: 'cover', height: '120px', width: '120px' }}
              />
              <h4 className="fw-bold">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'Traveler'}</h4>
              <p className="text-muted small">{user?.email || 'Welcome to TravelWorld'}</p>

              <div className="dashboard-menu mt-4 text-start">
                <Link to="/dashboard" className="d-block py-2"><i className="ri-dashboard-line me-2"></i> Dashboard</Link>
                <Link to="/profile" className="d-block py-2 active"><i className="ri-user-settings-fill me-2"></i> My Profile</Link>
                <Link to="/bookings" className="d-block py-2"><i className="ri-suitcase-line me-2"></i> My Bookings</Link>
                <Link to="/reviews" className="d-block py-2"><i className="ri-star-smile-line me-2"></i> Reviews</Link>
                <Link to="/wishlist" className="d-block py-2"><i className="ri-heart-line me-2"></i> Wishlist</Link>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg="9" md="8">
            <div className="dashboard-card mb-4 p-4 shadow-sm border-0 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h4 className="fw-bold m-0"><i className="ri-profile-line me-2"></i> User Information Center</h4>
                {!editMode && (
                  <Button className="btn primary__btn text-white rounded-pill px-4" onClick={handleEdit}>
                    <i className="ri-edit-box-line me-1"></i> Edit Profile
                  </Button>
                )}
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <Form onSubmit={handleSave}>
                <Row>
                  {/* Account Details */}
                  <h6 className="fw-bold mb-3 text-secondary">Account Basics</h6>
                  <Col md="6">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Username</label>
                      <input type="text" className="form-control" name="username" value={user.username} disabled />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Email Address</label>
                      <input type="email" name="email" className="form-control" value={form.email || ''} onChange={handleChange} disabled={!editMode} required pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$" title="Please enter a valid email address" />
                    </FormGroup>
                  </Col>

                  {/* Security & Picture */}
                  {editMode && (
                    <Col md="6">
                      <FormGroup>
                        <label className="fw-bold mb-1 small text-warning">New Password (optional)</label>
                        <input type="password" name="password" className="form-control" placeholder="Leave blank to keep current" value={form.password || ''} onChange={handleChange} />
                      </FormGroup>
                    </Col>
                  )}
                  {editMode && (
                    <Col md="6">
                      <FormGroup>
                        <label className="fw-bold mb-1 small text-info">Update Profile Picture</label>
                        <input type="file" name="profilePic" className="form-control" accept="image/*" onChange={handleChange} />
                      </FormGroup>
                    </Col>
                  )}

                  <hr className="my-4" />
                  <h6 className="fw-bold mb-3 text-secondary">Personal Details</h6>

                  <Col md="6">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">First Name</label>
                      <input type="text" name="firstName" className="form-control" placeholder="Your first name" value={form.firstName || ''} onChange={handleChange} disabled={!editMode} />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Last Name</label>
                      <input type="text" name="lastName" className="form-control" placeholder="Your last name" value={form.lastName || ''} onChange={handleChange} disabled={!editMode} />
                    </FormGroup>
                  </Col>
                  
                  <Col md="4">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Date of Birth</label>
                      <input type="date" name="dob" className="form-control" value={form.dob ? form.dob.split('T')[0] : ''} onChange={handleChange} disabled={!editMode} />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Gender</label>
                      <select name="gender" className="form-select" value={form.gender || ''} onChange={handleChange} disabled={!editMode}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Mobile Number</label>
                      <input type="tel" name="mobile" className="form-control" placeholder="10-digit number" pattern="^[0-9]{10}$" maxLength="10" title="Mobile number must be exactly 10 digits" value={form.mobile || ''} onChange={handleChange} disabled={!editMode} />
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Bio / About Yourself</label>
                      <textarea name="bio" className="form-control" rows="3" placeholder="Write a short summary about yourself..." value={form.bio || ''} onChange={handleChange} disabled={!editMode}></textarea>
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">City</label>
                      <input type="text" name="city" className="form-control" placeholder="City" value={form.city || ''} onChange={handleChange} disabled={!editMode} />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Country</label>
                      <input type="text" name="country" className="form-control" placeholder="Country" value={form.country || ''} onChange={handleChange} disabled={!editMode} />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Zip Code</label>
                      <input type="text" name="zipCode" className="form-control" placeholder="Postal Code" value={form.zipCode || ''} onChange={handleChange} disabled={!editMode} />
                    </FormGroup>
                  </Col>

                  <Col md="12" className="mt-3">
                    <FormGroup>
                      <label className="fw-bold mb-1 small">Account Level / Role</label>
                      <div>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-success'} p-2 rounded-pill shadow-sm`} style={{ fontSize: '0.85rem' }}>
                          <i className="ri-shield-user-line me-1"></i> {user.role === 'admin' ? 'Platform Administrator' : 'Standard User Member'}
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                {editMode && (
                  <div className="d-flex align-items-center gap-3 mt-4 pt-3 border-top">
                    <Button className="btn primary__btn text-white px-5 rounded-pill" type="submit" disabled={loading}>
                      <i className="ri-save-line me-1"></i> {loading ? 'Saving securely...' : 'Save Profile Details'}
                    </Button>
                    <Button className="btn btn-dark px-4 rounded-pill" type="button" onClick={handleCancel} disabled={loading}>
                      Cancel
                    </Button>
                  </div>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Profile;
