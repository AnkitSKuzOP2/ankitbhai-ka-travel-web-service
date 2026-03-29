import React from "react";

import FeaturedTourList from "../components/Featured-tours/FeaturedTourList";
import RotatingFeatured from "../components/Featured-tours/RotatingFeatured";

import "../styles/home.css";

import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/hero-img01.jpg";
import heroImg02 from "../assets/images/hero-img02.jpg";
import heroVideo from "../assets/images/hero-video.mp4";
import Subtitle from "../shared/Subtitle";
import worldImg from "../assets/images/world.png";
import Searchbar from "../shared/Searchbar";
import ServiceList from "../services/ServiceList";
import experienceImg from "../assets/images/experience.png";
import MasonryImageGallery from "../components/image-gallery/MasonryImageGallery";

const Home = () => {
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero_content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle Subtitle={"Know Before You Go"} />
                  <img src={worldImg} alt="" />
                </div>
                <h1>
                  Traveling opens the door to creating
                  <span className="highlight"> memories</span>
                </h1>
                <p>
                  Discover, plan, and book unforgettable adventures across
                  India's most breathtaking destinations. At{" "}
                  <b>TravelWorld</b>, we bring the world to your fingertips
                  — whether you're craving a tropical beach escape, a thrilling
                  mountain trek, or a cultural heritage tour, we have the
                  perfect journey waiting for you.
                  <br />
                  <br />
                  Start your next journey with confidence. Explore our best
                  destinations, search by location, and let us take care of the
                  rest.
                </p>
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box">
                <img src={heroImg} alt="" />
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} alt="" controls />
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="" controls />
              </div>
            </Col>
            <Searchbar />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">What we serve</h5>
              <h1 className="services__title">We offer our best services</h1>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle Subtitle={"Explore"} />
              <h2 className="featured_tour-title">Our featured tours</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle Subtitle={"Experience"} />
                <h2>
                  With our all experience <br />
                  we will serve you
                </h2>
                <p>
                  With over <b>5</b> years in the travel industry,{" "}
                  <b>TOURS AND TRAVELS BOOKING</b> has proudly helped thousands
                  of travelers explore the world with confidence and joy. Our
                  journey began with a passion for adventure and a mission to
                  make travel accessible, safe, and unforgettable for everyone
                  <br />
                  <br />
                  Whether you’re booking your first trip or your fiftieth, our
                  experienced team ensures every moment is planned to perfection
                  — from the first click to your final destination.
                  <br />
                  Travel with experts. Travel with heart.
                </p>
              </div>
              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>12k+</span>
                  <h6>Successful Trip</h6>
                </div>
                <div className="counter__box">
                  <span>2k+</span>
                  <h6>Regular clients</h6>
                </div>
                <div className="counter__box">
                  <span>5+</span>
                  <h6>Years experience</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle Subtitle={"Gallery"} />
              <h2 className="gallery__title">
                Visit our customers tour gallery
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImageGallery />
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle Subtitle={"Top Destinations"} />
              <h2 className="featured_tour-title">Explore our top destinations</h2>
            </Col>
            <Col lg="12">
              <RotatingFeatured intervalMs={60000} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
