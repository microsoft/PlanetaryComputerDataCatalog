import * as atlas from "azure-maps-control";
import { DATA_URL, REQUEST_ENTITY, X_REQUEST_ENTITY } from "utils/constants";
import { IStacItem } from "types/stac";
import { ILayerState } from "pages/Explore/types";
import { itemOutlineLayerName } from "pages/Explore/utils/layers";
import { getTileJsonAsset, makeRasterTileJsonUrl } from "utils";

export const mosaicLayerPrefix = "pc-mosaic-";

// const addAuthHeaders = (
//   url: string,
//   resourceType: atlas.ResourceType
// ): atlas.RequestParameters => {
//   resourceType === "Tile" && console.log(url, resourceType, DATA_URL);
//   if (resourceType === "Tile" && url?.startsWith(DATA_URL)) {
//     return { headers: { Authorization: `Bearer ${sessionStatus.token}` } };
//   }
//   return {};
// };

// Add request entity header to all tiler requests
export const addEntityHeader = (
  url: string,
  resourceType: atlas.ResourceType
): atlas.RequestParameters => {
  if (resourceType === "Tile" && url?.startsWith(DATA_URL)) {
    return {
      headers: {
        [X_REQUEST_ENTITY]: REQUEST_ENTITY,
      },
    };
  }
  return {};
};

export const makeLayerId = (id: string) => `${mosaicLayerPrefix}${id}`;
export const makeDatasourceId = (mapLayerId: string) => `${mapLayerId}-ds`;
export const makeLayerOutlineId = (mapLayerId: string) => `${mapLayerId}-outline`;
export const makeLayerHeatmapId = (mapLayerId: string) => `${mapLayerId}-heatmap`;

export const setupPolygonLayers = (
  map: atlas.Map,
  mapLayer: atlas.layer.Layer<atlas.layer.LayerEvents>,
  mapLayerId: string,
  mosaic: ILayerState
) => {
  const { collection, renderOption } = mosaic;
  const polygonLayer = mapLayer as atlas.layer.PolygonLayer;
  const isValid = renderOption !== null && collection !== null;
  if (renderOption?.vectorOptions === null) {
    throw new Error("Missing vectorOptions for layer render option");
  }

  if (isValid) {
    const polygonLayerOpts: atlas.PolygonLayerOptions = {
      sourceLayer: renderOption.vectorOptions?.sourceLayer,
      fillColor: renderOption.vectorOptions?.fillColor || "#000",
      visible: mosaic.layer.visible,
      fillOpacity: mosaic.layer.opacity / 100,
    };

    const polygonOutlineLayerOpts: atlas.LineLayerOptions = {
      sourceLayer: renderOption.vectorOptions?.sourceLayer,
      strokeColor: renderOption.vectorOptions?.strokeColor || "black",
      strokeWidth: renderOption.vectorOptions?.strokeWidth || 1,
      minZoom: 13,
      filter: [
        "any",
        ["==", ["geometry-type"], "Polygon"],
        ["==", ["geometry-type"], "MultiPolygon"],
      ],
      visible: mosaic.layer.visible,
      strokeOpacity: mosaic.layer.opacity / 100,
    };

    // const heatmapLayerOpts: atlas.HeatMapLayerOptions = {
    //   sourceLayer: renderOption.vectorOptions?.sourceLayer,
    //   weight: ["get", "point_count"],
    //   intensity: ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 1],
    //   radius: ["interpolate", ["linear"], ["zoom"], 1, 8, 9, 2],
    //   maxZoom: 9,
    //   color: [
    //     "interpolate",
    //     ["linear"],
    //     ["heatmap-density"],
    //     0,
    //     "rgba(0,0, 255,0)",
    //     0.1,
    //     "royalblue",
    //     0.6,
    //     "cyan",
    //     0.8,
    //     "yellow",
    //     0.9,
    //     "orange",
    //     1,
    //     "#8040bf",
    //   ],
    //   // opacity: mosaic.layer.opacity / 100,
    //   opacity: ["interpolate", ["exponential", 1], ["zoom"], 0, 1, 7, 2, 9, 0],
    //   visible: mosaic.layer.visible,
    // };

    if (polygonLayer) {
      polygonLayer.setOptions(polygonLayerOpts);

      const outline = map.layers.getLayerById(
        makeLayerOutlineId(mapLayerId)
      ) as atlas.layer.LineLayer;
      if (outline) {
        outline.setOptions(polygonOutlineLayerOpts);
      }

      // const heatmap = map.layers.getLayerById(
      //   mapLayerId + "-heatmap"
      // ) as atlas.layer.HeatMapLayer;
      // if (heatmap) {
      //   heatmap.setOptions(heatmapLayerOpts);
      // }
    } else {
      const dsId = makeDatasourceId(mapLayerId);
      const datasource = new atlas.source.VectorTileSource(dsId, {
        url: getTileJsonAsset(collection, renderOption),
      });

      const layer = new atlas.layer.PolygonLayer(
        datasource,
        mapLayerId,
        polygonLayerOpts
      );

      const outline = new atlas.layer.LineLayer(
        datasource,
        makeLayerOutlineId(mapLayerId),
        polygonOutlineLayerOpts
      );

      // const heatmap = new atlas.layer.HeatMapLayer(
      //   datasource,
      //   makeLayerHeatmapId(mapLayerId),
      //   heatmapLayerOpts
      // );

      map.sources.add(datasource);
      map.layers.add(outline, itemOutlineLayerName);
      map.layers.add(layer, outline);
      // map.layers.add(heatmap, "labels");
    }
  }
};

export const setupRasterTileLayer = (
  map: atlas.Map,
  mapLayerId: string,
  mapLayer: atlas.layer.Layer<atlas.layer.LayerEvents>,
  isItemLayerValid: boolean,
  id: string,
  currentEditingLayerId: string | null,
  stacItemForMosaic: IStacItem | null,
  mosaic: ILayerState
) => {
  const mosaicLayer = mapLayer as atlas.layer.TileLayer;
  const { collection, renderOption, query } = mosaic;
  const isMosaicLayerValid = Boolean(query.searchId);

  // The detail item selected is only valid for the currently editing layer
  const isItemForCurrentLayer = isItemLayerValid
    ? id === currentEditingLayerId
    : false;

  // Check if the configuration valid to add a mosaic layer
  if ((isMosaicLayerValid || isItemLayerValid) && renderOption) {
    const tileLayerOpts: atlas.TileLayerOptions = {
      tileUrl: makeRasterTileJsonUrl(
        query,
        renderOption,
        collection,
        isItemForCurrentLayer ? stacItemForMosaic : null
      ),
      visible: mosaic.layer.visible,
      opacity: mosaic.layer.opacity / 100,
    };

    // Valid and already added to the map, just update the options
    if (mosaicLayer) {
      mosaicLayer.setOptions(tileLayerOpts);
    } else {
      // Valid but not yet added to the map, add it
      const layer = new atlas.layer.TileLayer(tileLayerOpts, mapLayerId);
      map.layers.add(layer, itemOutlineLayerName);
    }
  } else {
    if (mosaicLayer) {
      // Remove visibility of the mosaic layer, rather than remove it from the map. As a result,
      // the opacity settings will be retained
      mosaicLayer.setOptions({ visible: false });
    }
  }
};

export const getRelatedLayers = (layerId: string, map: atlas.Map) => {
  // Order here is important, higher array indexes have a higher z index on the map.
  const relatedLayers = [
    layerId,
    makeLayerOutlineId(layerId),
    makeLayerHeatmapId(layerId),
  ];

  return relatedLayers.map(layer => map.layers.getLayerById(layer)).filter(Boolean);
};
