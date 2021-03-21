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
      for (var i = 0; i < layers.length; i++) {
        if (
          layers[i].type === "symbol" &&
          layers[i].source === "vectorTiles" &&
          layers[i].layout &&
          layers[i].layout["text-field"] &&
          layers[i].layout["text-field"] !== ""
        ) {
          mapRef.current.map.setLayoutProperty(
            layers[i].id,
            "visibility",
            "none"
          );
        }
      }

      // Add all bounding boxes to the datasource
      var source = new atlas.source.DataSource();
      mapRef.current.sources.add(source);

      const features = extent.bbox.map(bb => {
        return new atlas.data.Feature(atlas.math.boundingBoxToPolygon(bb));
      });

      const fc = new atlas.data.FeatureCollection(features);
      source.add(fc);

      // Take a bounding box of the entire feature collection, which
      // could have non-contiguous extents
      mapRef.current.setCamera({
        bounds: atlas.data.BoundingBox.fromData(fc),
        padding: 20,
      });

      // Add a line layer to render the outlines of the spatial extents
      mapRef.current.layers.add(
        new atlas.layer.LineLayer(source, "myLineLayer", {
          strokeColor: "blue",
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
        center: [-122.33, 47.6],
        zoom: 12,
        language: "en-US",
        showFeedbackLink: false,
        style: "grayscale_light",
        interactive: false,
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
    <div id="extent-map" style={{ width: "300px", height: "200px" }}></div>
  );
};

export default SpatialExtent;
