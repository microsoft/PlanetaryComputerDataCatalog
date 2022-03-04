import { useExploreSelector } from "pages/Explore/state/hooks";
import { updateQueryStringParam } from "pages/Explore/utils";
import { useEffect } from "react";

export const QS_SEPARATOR = "||";
export const QS_CUSTOM_PREFIX = "cql:";
export const QS_COLLECTION_KEY = "d";
export const QS_MOSAIC_KEY = "m";
export const QS_RENDER_KEY = "r";
export const QS_VERSION_KEY = "v";
export const QS_V1_CUSTOM_KEY = "q";

export const useUrlStateV2 = () => {
  const layers = useExploreSelector(s => s.mosaic.layers);

  useEffect(() => {
    const collections = Object.values(layers)
      .map(l => l.collection?.id)
      .filter(Boolean)
      .join(QS_SEPARATOR);
    updateQueryStringParam(QS_COLLECTION_KEY, collections);
    updateQueryStringParam(QS_VERSION_KEY, "2");

    const mosaics = Object.values(layers)
      .map(l => {
        // If layer has a custom query, use the search key, otherwise use the named mosaic
        return l.isCustomQuery
          ? `${QS_CUSTOM_PREFIX}${l.query.searchId}`
          : l.query.name;
      })
      .join(QS_SEPARATOR);
    updateQueryStringParam(QS_MOSAIC_KEY, mosaics);

    const renders = Object.values(layers)
      .map(l => l.renderOption?.name)
      .filter(Boolean)
      .join(QS_SEPARATOR);
    updateQueryStringParam(QS_RENDER_KEY, renders);
  }, [layers]);
};
