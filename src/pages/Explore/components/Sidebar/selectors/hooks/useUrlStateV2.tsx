import { isNumber } from "lodash-es";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { CurrentLayers, ILayerState } from "pages/Explore/types";
import { updateQueryStringParam } from "pages/Explore/utils";
import { useCallback, useEffect } from "react";

export const QS_SEPARATOR = "||";
export const QS_CUSTOM_PREFIX = "cql:";
export const QS_COLLECTION_KEY = "d";
export const QS_MOSAIC_KEY = "m";
export const QS_RENDER_KEY = "r";
export const QS_SETTINGS_KEY = "s";
export const QS_VERSION_KEY = "v";
export const QS_V1_CUSTOM_KEY = "q";

/**
 * Hook to  query string that encodes the current map layers and can be used for
 * sharing and recreating the app state
 */
export const useUrlStateV2 = () => {
  const layers = useExploreSelector(s => s.mosaic.layers);

  const setRenderQs = useCallback((layers: CurrentLayers) => {
    const renders = Object.values(layers)
      .map(l => l.renderOption?.name)
      .filter(Boolean)
      .join(QS_SEPARATOR);
    updateQueryStringParam(QS_RENDER_KEY, renders);
  }, []);

  const setMosiacQs = useCallback((layers: CurrentLayers) => {
    const mosaics = Object.values(layers)
      .map(l => {
        // If layer has a custom query, use the search key, otherwise use the named mosaic
        return l.isCustomQuery
          ? `${QS_CUSTOM_PREFIX}${l.query.searchId}`
          : l.query.name;
      })
      .join(QS_SEPARATOR);

    updateQueryStringParam(QS_MOSAIC_KEY, mosaics);
  }, []);

  const setCollectionQs = useCallback((layers: CurrentLayers) => {
    const collections = Object.values(layers)
      .map(l => l.collection?.id)
      .filter(Boolean)
      .join(QS_SEPARATOR);

    updateQueryStringParam(QS_COLLECTION_KEY, collections);
    updateQueryStringParam(QS_VERSION_KEY, "2");
  }, []);

  const setLayerSettingsQs = useCallback((layers: CurrentLayers) => {
    const settings = Object.values(layers)
      .map(l => serializeSettings(l))
      .join(QS_SEPARATOR);

    updateQueryStringParam(QS_SETTINGS_KEY, settings);
  }, []);

  useEffect(() => {
    setCollectionQs(layers);
    setMosiacQs(layers);
    setRenderQs(layers);
    setLayerSettingsQs(layers);
  }, [layers, setCollectionQs, setLayerSettingsQs, setMosiacQs, setRenderQs]);
};

/**
 * Serialize layer settings to a string
 * @param layer layer state to serialize settings values from
 * @returns {string}
 **/
const serializeSettings = (layer: ILayerState) => {
  return `${layer.isPinned}::${layer.layer.opacity}::${layer.layer.visible}`;
};

/**
 * Deserialize layer settings from the query string
 * @param settings string of settings in the order of isPinned, opacity, visible
 **/
export const deserializeSettings = (settings: string | undefined) => {
  if (settings) {
    const [isPinned, opacity, visible] = settings.split("::");
    return {
      isPinned: isPinned === "true",
      opacity: isNumber(parseInt(opacity)) ? parseInt(opacity) : 100,
      visible: visible ? visible === "true" : true,
    };
  }

  return {
    isPinned: false,
    opacity: 100,
    visible: true,
  };
};
