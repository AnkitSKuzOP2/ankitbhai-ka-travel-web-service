import React, { useState, useEffect } from "react";
import CommonSection from "./../shared/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";
import TourCard from "./../shared/TourCard";
import Newsletter from "./../shared/Newsletter";
import { BASE_URL } from "../utils/config";

const SearchResultList = () => {
  const location = useLocation();
  const [data, setData] = useState([]);

  useEffect(() => {
    // location.state can be an array (from Searchbar DB search) or have .data
    const state = location.state;
    if (Array.isArray(state) && state.length > 0) {
      setData(state);
    } else if (state && Array.isArray(state.data) && state.data.length > 0) {
      setData(state.data);
    } else {
      // fallback: load all tours
      fetch(`${BASE_URL}/tours`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch tours");
          return res.json();
        })
        .then((result) => {
          setData(result.data || []);
        })
        .catch(() => setData([]));
    }
  }, [location.state]);

  return (
    <>
      <CommonSection title={"Tour Search Result"} />
      <section>
        <Container>
          <Row>
            {data.length === 0 ? (
              <Col lg="12" className="text-center pt-4">
                <h4>No tours found matching your search.</h4>
                <p className="text-muted">Try a different city name or browse all tours above.</p>
              </Col>
            ) : (
              data.map((tour) => (
                <Col lg="3" md="6" sm="6" xs="12" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default SearchResultList;
