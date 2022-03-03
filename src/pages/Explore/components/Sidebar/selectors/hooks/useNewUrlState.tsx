import { useExploreSelector } from "pages/Explore/state/hooks";
import { updateQueryStringParam } from "pages/Explore/utils";
import { useEffect } from "react";

export const QS_SEPARATOR = "||";
export const QS_CUSTOM_KEY = "cql:";

export const useNewUrlState = () => {
  const layers = useExploreSelector(s => s.mosaic.layers);

  useEffect(() => {
    const collections = Object.values(layers)
      .map(l => l.collection?.id)
      .filter(Boolean)
      .join(QS_SEPARATOR);
    updateQueryStringParam("d", collections);

    const mosaics = Object.values(layers)
      .map(l => {
        // If layer has a custom query, use the search key, otherwise use the named mosaic
        return l.isCustomQuery
          ? `${QS_CUSTOM_KEY}${l.query.searchId}`
          : l.query.name;
      })
      .join(QS_SEPARATOR);
    updateQueryStringParam("m", mosaics);

    const renders = Object.values(layers)
      .map(l => l.renderOption?.name)
      .filter(Boolean)
      .join(QS_SEPARATOR);
    updateQueryStringParam("r", renders);
  }, [layers]);
};
