import React from "react";
import "./Footer.css";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";

import { Link } from "react-router-dom";
import logo from "../../../src/assets/images/logo.png";

const quick__links = [
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
];



const Footer = () => {

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3">
          <div className="logo">
            <img src={logo} alt=" "/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing. Eius harum cupiditate aliquid in doloremque assumenda, veritatis eveniet magnam reprehenderit. Eius illo deleniti eligendi, nobis aperiam nisi. Nesciunt, distinctio dolores?</p>
            
              <div className="social__links d-flex align-items-center gap-4">
              <span>
                <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer"><i className="ri-youtube-line"></i></a>
              </span>
              <span>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer"><i className="ri-github-fill"></i></a>
              </span>
              <span>
                <a href="https://facebook.com/ankittravels" target="_blank" rel="noopener noreferrer"><i className="ri-facebook-fill"></i></a>
              </span>
              <span>
                <a href="https://instagram.com/ankitmogger0129" target="_blank" rel="noopener noreferrer"><i className="ri-instagram-fill"></i></a>
              </span>
            </div>
          </div>
          </Col>

          <Col lg='3'>
           <h5 className="footer__link-title">Discover</h5>

           <ListGroup className="footer__quick-links">
           {quick__links.map((item, index) => (
           <ListGroupItem key={index} className="ps-0 border-0">
            <Link to={item.path}>{item.display}</Link>
            </ListGroupItem>
            ))}
           </ListGroup>
           </Col>
          <Col lg='3'>
          <h5 className="footer__link-title">Quick Links</h5>

             <ListGroup className="footer__quick-links">
             {quick__links.map((item, index) => (
             <ListGroupItem key={index} className="ps-0 border-0">
            <Link to={item.path}>{item.display}</Link>
            </ListGroupItem>
           ))}
          </ListGroup>
                    </Col>
                    <Col lg='3'>
                    <h5 className="footer__link-title">Contact</h5>

             <ListGroup className="footer__quick-links">
             
              <ListGroupItem  className="ps-0 border-0 d-flex align-items-center gap-3">

              <h6 className="mb-0 d-flex align-items-center gap-2">
                <span>
                <i className="ri-map-pin-line"></i>
               
                </span>
                addresses:
              </h6>

              <p className="mb-0">ankit, anant</p>
              </ListGroupItem>
              <ListGroupItem  className="ps-0 border-0 d-flex align-items-center gap-3">

             <h6 className="mb-0 d-flex align-items-center gap-2">
            <span>
            <i className="ri-mail-line"></i>
           Email:
  </span>
</h6>

<p className="mb-0">ankitmouriya0129@gmail.com</p>
              </ListGroupItem>
              <ListGroupItem  className="ps-0 border-0 d-flex align-items-center gap-3">

             <h6 className="mb-0 d-flex align-items-center gap-2">
            <span>
            <i className="ri-phone-line"></i>
           Phone:
  </span>
</h6>



<p className="mb-0">+94703281170,+94772849767</p>

</ListGroupItem>
          </ListGroup>
        </Col>
                       
                        
                         <Col lg='12' className="text-center pt-5"><p className="copyright">Copyright 2025, 
                      design and developed by Mogger gang leader ankit Developed by Ankit & Jaydeep. All rights reserved.</p>
                        </Col>       
                 </Row>
               </Container>
              </footer>
  );

};
export default Footer;