import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import CenteredBounds from "../controls/CenteredBounds";

const SpatialExtent = ({ extent }) => {
  if (!extent) return null;

  return (
    <div style={{ width: "300px", height: "200px" }}>
      <MapContainer
        center={[-90, 90]}
        zoom={4}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <CenteredBounds extent={extent} />
      </MapContainer>
    </div>
  );
};

export default SpatialExtent;
