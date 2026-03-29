import React, { useContext, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button, Modal, ModalBody } from "reactstrap";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [navTarget, setNavTarget] = useState("/");

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!credentials.email || credentials.email.trim() === '') {
      return setErrorMsg("Please enter your email.");
    }
    if (!credentials.password || credentials.password.trim() === '') {
      return setErrorMsg("Please enter your password.");
    }

    dispatch({ type: "LOGIN_START" });

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();
      if (!res.ok) {
        dispatch({ type: "LOGIN_FAILURE", payload: result.message });
        return setErrorMsg(result.message);
      }

      console.log(result.data);

      // Merge token and role into user object for AuthContext
      const userWithToken = { ...result.data, token: result.token, role: result.role || result.data.role };
      dispatch({ type: "LOGIN_SUCCESS", payload: userWithToken });
      
      setWelcomeMsg(userWithToken.username);
      setNavTarget(userWithToken.role === "admin" ? "/admin-dashboard" : "/");
      setShowWelcome(true);
      
      // Auto-navigate after 2 seconds if user doesn't click
      setTimeout(() => {
        if (window.location.pathname === "/login") {
          navigate(userWithToken.role === "admin" ? "/admin-dashboard" : "/");
        }
      }, 2500);

    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
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
                  <h2 className="mb-4">Login</h2>
                
                {errorMsg && <div className="alert alert-danger p-2 text-center" style={{fontSize: "0.9rem"}}>{errorMsg}</div>}

                <Form onSubmit={handleClick} className="d-flex flex-column flex-grow-1">
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Email Address"
                      id="email"
                      className="form-control p-3 shadow-sm border-0 bg-light"
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="mt-4">
                    <input
                      type="password"
                      placeholder="Secure Password"
                      id="password"
                      className="form-control p-3 shadow-sm border-0 bg-light"
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <div className="mt-auto pt-4">
                    <Button
                      className="btn w-100 fw-bold border-0 shadow-lg text-white"
                      style={{ background: "linear-gradient(135deg, #212529 0%, #000 100%)", padding: "14px", transition: "all 0.3s ease", letterSpacing: "1px" }}
                      type="submit"
                    >
                      Login
                    </Button>
                  </div>
                  </Form>
                  <p className="mt-4 text-center mb-0">
                    Don't have an account? <Link to="/register" className="text-primary fw-bold">Create Account</Link>
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal isOpen={showWelcome} centered backdrop="static" className="border-0">
        <ModalBody className="text-center p-5 rounded shadow-lg">
          <i className="ri-checkbox-circle-fill text-success" style={{ fontSize: "5rem" }}></i>
          <h2 className="mt-3 fw-bold text-dark">Welcome, {welcomeMsg}!</h2>
          <p className="text-muted mt-2 fs-5">You have successfully logged in.</p>
          <Button color="primary" className="fw-bold mt-4 px-5 py-2 rounded-pill" onClick={() => navigate(navTarget)}>
            Let's Go!
          </Button>
        </ModalBody>
      </Modal>
    </section>
  );
};

export default Login;
