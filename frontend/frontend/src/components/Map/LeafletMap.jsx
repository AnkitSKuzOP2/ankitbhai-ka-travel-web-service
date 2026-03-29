import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// Example default position (Mumbai); adjust as needed
const defaultPosition = [19.0760, 72.8777];

const LeafletMap = ({ center = defaultPosition, zoom = 13 }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={new Icon.Default()}>
        <Popup>Example location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;

