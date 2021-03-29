import React, { useEffect, useState, useRef } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

const SpatialExtent = ({ extent }) => {
  const mapRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded) {
      var layers = mapRef.current.map.getStyle().layers;

      // This will remove layer labels from the basemap, which tend to
      // repeat in a overwhelming way at low zoom levels
      layers.forEach(layer => {
        if (
          layer.type === "symbol" &&
          layer.source === "vectorTiles" &&
          layer.layout &&
          layer.layout["text-field"] &&
          layer.layout["text-field"] !== ""
        ) {
          mapRef.current.map.setLayoutProperty(layer.id, "visibility", "none");
        }

        if (
          [
            "Country border",
            "Disputed country border",
            "State border",
          ].includes(layer["source-layer"])
        ) {
          mapRef.current.map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      // Add all bounding boxes to the datasource
      var source = new atlas.source.DataSource();
      mapRef.current.sources.add(source);

      const features = extent.bbox.map(bb => {
        return new atlas.data.Feature(atlas.math.boundingBoxToPolygon(bb));
      });

      const fcollection = new atlas.data.FeatureCollection(features);
      const extentBbox = atlas.data.BoundingBox.fromData(fcollection);
      source.add(fcollection);

      // Take a bounding box of the entire feature collection, which
      // could have non-contiguous extents
      mapRef.current.setCamera({
        bounds: extentBbox,
        padding: 20,
      });

      // Add a line layer to render the outlines of the spatial extents
      mapRef.current.layers.add(
        new atlas.layer.LineLayer(source, "myLineLayer", {
          strokeColor: "#fff",
          strokeWidth: 1.5,
          strokeOpacity: 0.5,
        }),
        "labels"
      );
    }
  }, [mapLoaded, extent]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new atlas.Map("extent-map", {
        view: "Auto",
        center: [90, -90],
        zoom: 12,
        language: "en-US",
        showFeedbackLink: false,
        style: "grayscale_dark",
        renderWorldCopies: true, // This setting may need adjusment for showing whole-world bounds
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: process.env.REACT_APP_AZMAPS_KEY,
        },
      });

      mapRef.current.events.add("ready", () => setMapLoaded(true));

      // TODO unregister on cleanup
    }
  }, []);

  if (!extent) return null;

  return (
    <div id="extent-map" style={{ width: "250px", height: "150px" }}></div>
  );
};

export default SpatialExtent;
