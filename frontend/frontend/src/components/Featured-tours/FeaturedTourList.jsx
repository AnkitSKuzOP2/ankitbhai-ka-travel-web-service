import React from "react";
import TourCard from "../../shared/TourCard";
// import tourData from '../../assets/data/tours'
import { Col } from "reactstrap";
import useFetch from "./../../hooks/useFetch";
import { BASE_URL } from "./../../utils/config";

const FeaturedTourList = () => {
  const {
    data: featuredTours,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours/search/getFeaturedTours`);
  // console.log(featuredTours)

  return (
    <>
      {loading && <h4>Loading.....</h4>}
      {error && <h4>{error}</h4>}
      {!loading && !error && (
        <>
          {Array.isArray(featuredTours) && featuredTours.length === 0 && (
            <h5>No featured tours available</h5>
          )}
          {featuredTours?.map((tour) => (
            <Col lg="3" md="4" sm="6" className="mb-4" key={tour._id}>
              <TourCard tour={tour} />
            </Col>
          ))}
        </>
      )}
    </>
  );
};

export default FeaturedTourList;
