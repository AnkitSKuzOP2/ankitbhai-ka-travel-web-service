import React, { useEffect, useRef, useContext, useState } from "react";
import { Container, Row, Button, Modal, ModalBody } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import "./Header.css";
import { AuthContext } from "../../context/AuthContext";

const nav__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/tours",
    display: "Tours",
  },
  {
    path: "/places",
    display: "Places",
  },
  {
    path: "/hotels",
    display: "Hotels",
  },
  {
    path: "/guides",
    display: "Guides",
  },
  {
    path: "/weather",
    display: "Weather",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    setShowLogoutMsg(true);
    
    // Auto-navigate after 2 seconds if user doesn't click
    setTimeout(() => {
      setShowLogoutMsg(false);
      navigate("/");
    }, 2500);
  };

  const closeLogoutModal = () => {
    setShowLogoutMsg(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        if (headerRef.current) headerRef.current.classList.add("sticky__header");
      } else {
        if (headerRef.current) headerRef.current.classList.remove("sticky__header");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            <div className="logo d-flex align-items-center gap-3">
              <span onClick={toggleTheme} style={{ cursor: "pointer", fontSize: "1.5rem", color: isDarkMode ? "#faa935" : "#ff7e01" }}>
                {isDarkMode ? <i className="ri-sun-fill"></i> : <i className="ri-sun-line"></i>}
              </span>
              <img src={Logo} alt="" />
            </div>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index} onClick={toggleMenu}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
                <div className="mobile__auth__btns d-lg-none d-flex flex-column align-items-center gap-3 mt-4 w-100 px-4">
                  {user ? (
                      <>
                      <h5 className="mb-0 text-center" style={{ color: 'var(--heading-color)' }}>{user.username}</h5>
                      {user.role === 'admin' ? (
                        <Button className="btn btn-warning w-100 py-2">
                          <Link to="/admin-dashboard" onClick={toggleMenu} style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
                        </Button>
                      ) : (
                        <Button className="btn btn-info w-100 py-2">
                          <Link to="/dashboard" onClick={toggleMenu} style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
                        </Button>
                      )}
                      <Button className="btn btn-info w-100 py-2">
                        <Link to="/profile" onClick={toggleMenu} style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
                      </Button>
                      <Button className="btn btn-dark w-100 py-2" onClick={() => { logout(); toggleMenu(); }}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="btn secondary__btn w-100 py-2" onClick={toggleMenu}>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button className="btn primary__btn w-100 py-2" onClick={toggleMenu}>
                        <Link to="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </ul>
            </div>

            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-none d-lg-flex align-items-center gap-2">
                {user ? (
                    <>
                    <h5 className="mb-0">{user.username}</h5>
                    {user.role === 'admin' ? (
                      <Button className="btn btn-warning">
                        <Link to="/admin-dashboard" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
                      </Button>
                    ) : (
                      <Button className="btn btn-info">
                        <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
                      </Button>
                    )}
                    <Button className="btn btn-info">
                      <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
                    </Button>
                    <Button className="btn btn-dark" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
                {/* <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                        <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button> */}
              </div>

              <span className="mobile__menu d-lg-none" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
      
      {/* Logout Message Modal */}
      <Modal isOpen={showLogoutMsg} centered backdrop="static" className="border-0">
        <ModalBody className="text-center p-5 rounded shadow-lg">
          <i className="ri-information-line text-info" style={{ fontSize: "5rem" }}></i>
          <h2 className="mt-3 fw-bold text-dark">Logged Out</h2>
          <p className="text-muted mt-2 fs-5">You have been logged out securely.</p>
          <Button color="info" className="fw-bold mt-4 px-5 py-2 rounded-pill text-white" onClick={closeLogoutModal}>
            Back to Home
          </Button>
        </ModalBody>
      </Modal>
    </header>
  );
};

export default Header;
