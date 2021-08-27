import * as atlas from "azure-maps-control";

export const layerControl = new atlas.control.StyleControl({
  mapStyles: [
    "road",
    "road_shaded_relief",
    "grayscale_light",
    "night",
    "grayscale_dark",
    "satellite",
    "satellite_road_labels",
  ],
});

export const stacItemDatasource = new atlas.source.DataSource();

export const itemLineLayer = new atlas.layer.LineLayer(
  stacItemDatasource,
  "stac-item-outline",
  {
    strokeColor: "rgb(0, 120, 212)",
    strokeWidth: 3,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  }
);

export const itemPolyLayer = new atlas.layer.PolygonLayer(
  stacItemDatasource,
  "stac-item-fill",
  {
    fillColor: "rgba(255, 255, 255, 0.3)",
  }
);

export const itemHoverLayer = new atlas.layer.PolygonLayer(
  stacItemDatasource,
  "stac-hover-fill",
  {
    // select nothing as a base case
    filter: ["==", ["get", "id"], ""],
    fillColor: "rgba(150, 50, 255, 0.9)",
  }
);

export const getHighlightItemFn = (map: atlas.Map) => {
  return (e: atlas.MapMouseEvent) => {
    map.getCanvasContainer().style.cursor = "pointer";

    if (e?.shapes?.length) {
      const shape = e.shapes[0] as atlas.Shape;
      const stacId: string = shape.getId().toString();
      itemHoverLayer.setOptions({
        filter: ["==", ["get", "stacId"], stacId],
      });
    }
  };
};

export const getUnhighlightItemFn = (map: atlas.Map) => {
  return () => {
    map.getCanvasContainer().style.cursor = "grab";
    itemHoverLayer.setOptions({ filter: ["==", ["get", "stacId"], ""] });
  };
};
