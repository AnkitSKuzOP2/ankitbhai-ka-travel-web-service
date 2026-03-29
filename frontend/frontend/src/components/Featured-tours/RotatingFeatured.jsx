import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import useFetch from "./../../hooks/useFetch";
import { BASE_URL } from "./../../utils/config";
import TourCard from "./../../shared/TourCard";

const RotatingFeatured = ({ intervalMs = 60000 }) => {
  const { data: featuredTours, loading, error } = useFetch(
    `${BASE_URL}/tours/search/getFeaturedTours`
  );

  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (!featuredTours || featuredTours.length === 0) return;

    const tick = () => {
      setStartIndex((prev) => (prev + 3) % featuredTours.length);
    };

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [featuredTours, intervalMs]);

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>{error}</h4>;

  const items = featuredTours || [];
  if (items.length === 0) return <h5>No featured destinations</h5>;

  // select up to 3 items starting at startIndex, wrapping around
  const slice = [];
  for (let i = 0; i < Math.min(3, items.length); i++) {
    slice.push(items[(startIndex + i) % items.length]);
  }

  return (
    <Row>
      {slice.map((tour) => (
        <Col lg="4" md="6" sm="12" className="mb-4" key={tour._id}>
          <TourCard tour={tour} />
        </Col>
      ))}
    </Row>
  );
};

export default RotatingFeatured;
