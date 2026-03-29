import React, { useState } from "react";

import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const defaultCenter = { lat: 28.7041, lng: 77.1025 };

const PlacesMap = ({ places }) => {
  const [selected, setSelected] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });

  if (!isLoaded) return <div>Loading map...</div>;

  const center = places && places.length && places[0].geometry && places[0].geometry.location
    ? { lat: places[0].geometry.location.lat, lng: places[0].geometry.location.lng }
    : defaultCenter;

  // determine recommended top-3 by rating
  const rated = (places || []).filter((p) => typeof p.rating === "number").slice();
  rated.sort((a, b) => b.rating - a.rating);
  const recommendedIds = new Set(rated.slice(0, 3).map((p) => p.place_id));

  return (
    <GoogleMap mapContainerClassName="places-map-container" center={center} zoom={13}>
      {places && places.map((p) => {
        const isRecommended = recommendedIds.has(p.place_id);
        const icon = isRecommended
          ? "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
          : "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

        return (
          <Marker
            key={p.place_id}
            position={{ lat: p.geometry.location.lat, lng: p.geometry.location.lng }}
            onClick={() => setSelected(p)}
            icon={icon}
          />
        );
      })}

      {selected && (
        <InfoWindow
          position={{ lat: selected.geometry.location.lat, lng: selected.geometry.location.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <h6>{selected.name}</h6>
            {selected.rating && <p>Rating: {selected.rating}</p>}
            {selected.formatted_address && <p>{selected.formatted_address}</p>}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default PlacesMap;
