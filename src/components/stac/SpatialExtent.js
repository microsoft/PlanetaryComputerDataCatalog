import React from "react";
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapLayerProvider,
  AzureMapsProvider,
} from "react-azure-maps";

import { AuthenticationType } from "azure-maps-control";

const option = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: process.env.REACT_APP_AZMAPS_KEY,
  },
  showLogo: false,
  style: "grayscale_light",
  showFeedbackLink: false,
};

const SpatialExtent = ({ extent }) => {
  if (!extent) return null;

  const shapes = extent.bbox.map(bb => {
    const [minX, minY, maxX, maxY] = bb;
    return [
      [minX, maxY],
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
    ];
  });

  return (
    <AzureMapsProvider>
      <div
        style={{ border: "1px solid #ccc", height: "250px", width: "250px" }}
      >
        <AzureMap options={option}>
          <AzureMapDataSourceProvider id="extent-datasource">
            <AzureMapLayerProvider
              id="spatial-extent"
              options={{
                fillOpacity: 0,
                strokeOpacity: 0.8,
                strokeColor: "#ff0",
              }}
              type={"PolygonLayer"}
            />
            {shapes.map((shape, idx) => {
              return (
                <AzureMapFeature
                  key={`shape-${idx}`}
                  id="collection-extent"
                  type="Polygon"
                  coordinates={shape}
                />
              );
            })}
          </AzureMapDataSourceProvider>
        </AzureMap>
      </div>
    </AzureMapsProvider>
  );
};

export default SpatialExtent;
