import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./Tour-card.css";
import calculateAvgRating from "../utils/avgRating";

const TourCard = ({ tour }) => {
  const { _id, title, city, address, distance, photo, price, featured, reviews } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img
            src={
              photo
                ? photo.startsWith("http")
                  ? photo
                  : photo.startsWith("/tour-images/")
                    ? photo
                    : `/tour-images/${photo}`
                : '/tour-images/tour-img01.jpg'
            }
            alt="tour-img"
            onError={e => { e.target.onerror = null; e.target.src = '/tour-images/tour-img01.jpg'; }}
          />
          {featured && <span>Featured</span>}
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex justify-content-center align-items-center gap-1">
              <i className="ri-map-pin-line"></i>{" "}
              <a
                href={`https://maps.google.com/maps?q=${encodeURIComponent((address || "") + " " + (city || ""))}`}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none text-dark"
                style={{ cursor: "pointer" }}
              >
                {city} {address && <small>({address})</small>}
              </a>
            </span>
            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-fill text-warning"></i>{" "}
              {avgRating === 0 ? null : avgRating}
              {totalRating === 0 ? (
                "Not rated"
              ) : (
                <span>({reviews?.length || 0})</span>
              )}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/tours/${_id}`}>{title}</Link>
          </h5>

          <div className="tour__distance d-flex align-items-center gap-1 mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
            <i className="ri-map-pin-time-line"></i> {distance ? `${distance} km away` : "Distance not available"}
          </div>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              ₹{price} <span> /per person</span>
            </h5>

            <Link to={`/tours/${_id}`}>
              <button className="booking__btn">Book Now</button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
