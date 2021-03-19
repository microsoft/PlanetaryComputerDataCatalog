import React, { useRef } from "react";
import { Rectangle, FeatureGroup, useMap } from "react-leaflet";

const CenteredBounds = ({ extent }) => {
  const map = useMap();
  const group = useRef();

  const rectangles = extent.bbox.map(bb => {
    const [minX, minY, maxX, maxY] = bb;
    return [
      [minY, maxX],
      [maxY, minX],
    ];
  });

  const boxStyle = {
    stroke: true,
    fill: false,
    weight: 1.5,
    opacity: 0.5,
    color: "blue",
  };

  const handleLayerAdded = () => {
    map.fitBounds(group.current.getBounds(), { padding: [20, 20] });
  };

  return (
    <FeatureGroup
      ref={group}
      eventHandlers={{
        add: handleLayerAdded,
      }}
    >
      {rectangles.map((bounds, idx) => (
        <Rectangle
          key={`extent-${idx}`}
          pathOptions={boxStyle}
          bounds={bounds}
        />
      ))}
    </FeatureGroup>
  );
};

export default CenteredBounds;
