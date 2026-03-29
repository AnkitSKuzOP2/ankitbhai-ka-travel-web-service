import React, { useRef } from "react";
import "./Search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from "./../utils/config";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const locationRef = useRef("");
  const navigate = useNavigate();

  const searchHandler = async (e) => {
    e.preventDefault();
    const location = locationRef.current.value.trim();
    if (location === "") return alert("Please enter a location");

    try {
      // Search the database for tours matching the city name
      const res = await fetch(
        `${BASE_URL}/tours/search/getTourBySearch?city=${encodeURIComponent(location)}&distance=0&maxGroupSize=1`
      );
      if (!res.ok) return alert("Something went wrong searching tours");
      const result = await res.json();
      const tours = result.data || [];

      // Navigate to search results — pass tours in location state
      navigate("/tours/search", { state: tours });
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4" onSubmit={searchHandler}>
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-line"></i>
            </span>
            <div>
              <h6>Location</h6>
              <input type="text" placeholder="Where are you going" ref={locationRef} />
            </div>
          </FormGroup>

          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </Form>
      </div>
    </Col>
  );
};

export default Searchbar;
