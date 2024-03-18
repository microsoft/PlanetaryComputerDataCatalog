import { Spinner, SpinnerSize } from "@fluentui/react";

interface MapReadyIndicatorProps {
  isMapReady: boolean;
}

const MapReadyIndicator: React.FC<MapReadyIndicatorProps> = ({ isMapReady }) => {
  if (isMapReady) {
    return null;
  }

  return (
    <div style={{ top: "50vh", left: "60vw", zIndex: 1, position: "fixed" }}>
      <Spinner size={SpinnerSize.large} />
    </div>
  );
};

export default MapReadyIndicator;
