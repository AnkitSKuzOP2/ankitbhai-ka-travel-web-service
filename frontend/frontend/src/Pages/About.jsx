import React, { useState } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/about.css";
import devPhoto from "../assets/images/logo.png";
import { BASE_URL } from "../utils/config";

const About = () => {
  const [formData, setFormData] = useState({ name: "", email: "", opinion: "", improve: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${BASE_URL}/feedback`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", opinion: "", improve: "" });
        setTimeout(() => {
            setIsSubmitted(false);
        }, 6000);
      } else {
        alert(result.message || "Failed to submit feedback.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CommonSection title={"About Us"} />
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h3>About Our Travel Service</h3>
            <p>
              Welcome! We help travellers discover great places and book
              experiences. Follow us on social media for updates and offers.
            </p>

            <div className="social-row">
              <a
                className="social-item"
                href="https://instagram.com/ankitmogger0129"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-instagram-fill"></i>
                <div>
                  <div className="social-name">Instagram</div>
                  <div className="social-username">@ankitmogger0129</div>
                </div>
              </a>

              <a
                className="social-item"
                href="https://facebook.com/ankittravels"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-facebook-fill"></i>
                <div>
                  <div className="social-name">Facebook</div>
                  <div className="social-username">/ankittravels</div>
                </div>
              </a>

              <a
                className="social-item"
                href="https://t.me/ankitmogger"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-telegram-fill"></i>
                <div>
                  <div className="social-name">Telegram</div>
                  <div className="social-username">@ankitmogger</div>
                </div>
              </a>
            </div>

            <div className="feedback">
              <h5>Feedback</h5>
              <p>
                We'd love to hear from you! Please share your experience and thoughts on how we can improve.
              </p>
              
              {isSubmitted ? (
                <div className="alert alert-success d-flex flex-column align-items-center justify-content-center p-4" style={{ borderRadius: '15px' }}>
                  <i className="ri-checkbox-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-2 fw-bold text-success">Feedback Sent!</h4>
                  <p className="mb-0 text-center">Thank you for helping us improve our platform.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="text-start mt-4">
                  <div className="mb-3">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Your Name" 
                      className="form-control px-3 py-2 shadow-sm border-0" 
                      style={{ backgroundColor: '#f4f5f9', borderRadius: '10px' }}
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Your Email" 
                      className="form-control px-3 py-2 shadow-sm border-0" 
                      style={{ backgroundColor: '#f4f5f9', borderRadius: '10px' }}
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <textarea 
                      name="opinion"
                      placeholder="What is your opinion about our service?" 
                      className="form-control px-3 py-2 shadow-sm border-0" 
                      style={{ backgroundColor: '#f4f5f9', borderRadius: '10px', minHeight: '100px' }}
                      value={formData.opinion}
                      onChange={handleChange}
                      required 
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <textarea 
                      name="improve"
                      placeholder="What can we improve? (Features, Design, etc.)" 
                      className="form-control px-3 py-2 shadow-sm border-0" 
                      style={{ backgroundColor: '#f4f5f9', borderRadius: '10px', minHeight: '80px' }}
                      value={formData.improve}
                      onChange={handleChange}
                      required 
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 shadow rounded-pill fw-bold" 
                    disabled={isSubmitting}
                    style={{ transition: 'all 0.3s' }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </button>
                </form>
              )}
            </div>
            <div className="developer-credit mt-4">
              <div className="dev-photo">
                <img src={devPhoto} alt="Ankit" />
              </div>
              <h5>Developed by Ankit & Jaydeep</h5>
              <p>
                I developed this website in 7 days to demonstrate a simple travel
                booking experience. The site runs as a React single-page
                application with an Express/MongoDB backend, integrates
                Google Maps/Places for searching locations and showing ratings,
                and includes a booking flow for users. If you have feedback or
                suggestions, please get in touch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
