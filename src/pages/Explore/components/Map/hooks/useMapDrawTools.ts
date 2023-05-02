import { useRef } from "react";
import * as atlas from "azure-maps-control";
import { drawing } from "azure-maps-drawing-tools";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setBboxDrawMode, setDrawnShape } from "pages/Explore/state/mapSlice";
import { IDrawnShape } from "pages/Explore/types";
import { getTheme } from "@fluentui/react";

const theme = getTheme();

export const useMapDrawTools = (
  mapRef: React.MutableRefObject<atlas.Map | null>,
  mapReady: boolean
) => {
  const dispatch = useExploreDispatch();
  const drawMgrRef = useRef<drawing.DrawingManager | null>(null);
  const { isDrawBboxMode, drawnShape } = useExploreSelector(s => s.map);

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

  if (!drawnShape && drawMgrRef.current.getSource().getShapes().length > 0) {
    drawMgrRef.current.getSource().clear();
  }

  const handleShapeAdded = (shape: atlas.Shape): void => {
    const geometry = shape.toJson().geometry;
    // getBounds does not reliable generate a valid bounding box
    // for drawn polygons, so ensure the order is xmin, ymin, xmax, ymax
    const bounds = shape.getBounds();
    const bbox = [
      Math.min(bounds[0], bounds[2]),
      Math.min(bounds[1], bounds[3]),
      Math.max(bounds[0], bounds[2]),
      Math.max(bounds[1], bounds[3]),
    ];

    const drawnShape: IDrawnShape = {
      geometry,
      bbox,
    };

    dispatch(setDrawnShape(drawnShape));
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
