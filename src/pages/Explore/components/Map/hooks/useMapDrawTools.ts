import { useRef } from "react";
import * as atlas from "azure-maps-control";
import { drawing } from "azure-maps-drawing-tools";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setBboxDrawMode, setDrawnBbox } from "pages/Explore/state/mapSlice";
import { getTheme } from "@fluentui/react";

const theme = getTheme();

export const useMapDrawTools = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const dispatch = useExploreDispatch();
  const drawMgrRef = useRef<drawing.DrawingManager | null>(null);
  const { isDrawBboxMode, drawnBbox } = useExploreSelector(s => s.map);

  // Initialize the drawing manager when the map is ready
  if (!drawMgrRef.current && mapRef.current && mapReady) {
    const mgr = new drawing.DrawingManager(mapRef.current, {
      shapeDraggingEnabled: true,
      mode: drawing.DrawingMode.idle,
    });

    // Styles for drawn bboxes
    const drawnLayers = mgr.getLayers();
    drawnLayers.polygonOutlineLayer?.setOptions({
      strokeColor: theme.palette.themePrimary,
      strokeDashArray: [2, 2],
      strokeWidth: 4,
    });

    drawMgrRef.current = mgr;
  }

  if (!drawMgrRef.current || !mapRef.current) return;

  const { mode } = drawMgrRef.current.getOptions();

  if (!drawnBbox && drawMgrRef.current.getSource().getShapes().length > 0) {
    drawMgrRef.current.getSource().clear();
  }

  const handleShapeAdded = (shape: atlas.Shape): void => {
    const bounds = shape.getBounds();
    dispatch(setDrawnBbox(bounds));
    dispatch(setBboxDrawMode(false));

    if (drawMgrRef.current) {
      mapRef.current?.events.remove(
        "drawingcomplete",
        drawMgrRef.current,
        handleShapeAdded
      );
    }
  };

  // Enable drawing mode
  if (isDrawBboxMode && mode !== drawing.DrawingMode.drawRectangle) {
    drawMgrRef.current.getSource().clear();
    drawMgrRef.current?.setOptions({
      mode: drawing.DrawingMode.drawRectangle,
    });

    mapRef.current.events.add(
      "drawingcomplete",
      drawMgrRef.current,
      handleShapeAdded
    );
  }

  // Disable drawing mode
  if (!isDrawBboxMode && mode !== drawing.DrawingMode.idle) {
    drawMgrRef.current?.setOptions({
      mode: drawing.DrawingMode.idle,
    });
  }
};
