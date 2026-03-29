import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";

import { BASE_URL } from "../utils/config";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    
    if (!credentials.username || credentials.username.trim() === '') {
      return setErrorMsg("Please choose a unique username");
    }
    if (!credentials.email || credentials.email.trim() === '') {
      return setErrorMsg("Please enter an email address");
    }
    if (!credentials.password || credentials.password.trim() === '') {
      return setErrorMsg("Please create a protected password");
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const result = await res.json();

      if (!res.ok) {
        return setErrorMsg(result.message);
      }

      setSuccessMsg("Successfully registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-center">
              <div className="login__form w-100 d-flex flex-column justify-content-between" style={{ minHeight: '65vh' }}>
                <div className="form-content">
                  <h2 className="mb-4">Register</h2>
                
                {errorMsg && <div className="alert alert-danger p-2 text-center" style={{fontSize: "0.9rem"}}>{errorMsg}</div>}
                {successMsg && <div className="alert alert-success p-2 text-center" style={{fontSize: "0.9rem"}}>{successMsg}</div>}

                  <Form onSubmit={handleClick} className="d-flex flex-column flex-grow-1">
                    <FormGroup>
                      <input
                        type="text"
                        placeholder="Choose Username"
                        id="username"
                        onChange={handleChange}
                        required
                        pattern="[A-Za-z0-9_]{3,20}"
                        title="Username must be 3-20 characters long and can only contain letters, numbers, and underscores"
                        className="form-control p-3 shadow-sm border-0 bg-light"
                      />
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <input
                        type="email"
                        placeholder="Valid Email Address"
                        id="email"
                        onChange={handleChange}
                        required
                        className="form-control p-3 shadow-sm border-0 bg-light"
                      />
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <input
                        type="password"
                        placeholder="Create Password"
                        id="password"
                        onChange={handleChange}
                        required
                        minLength="6"
                        title="Password must be at least 6 characters"
                        className="form-control p-3 shadow-sm border-0 bg-light"
                      />
                    </FormGroup>
                    <div className="mt-auto pt-4">
                      <Button
                        className="btn w-100 fw-bold border-0 shadow-lg text-white"
                        style={{ background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)", transition: "all 0.3s ease", padding: "14px", letterSpacing: "1px" }}
                        type="submit"
                      >
                        Register
                      </Button>
                    </div>
                  </Form>
                  <p className="mt-4 text-center mb-0">
                    Already have an account? <Link to="/login" className="text-warning fw-bold">Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
