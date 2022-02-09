import { useEffect, useState } from "react";

import { useQueryString } from "utils/hooks";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  selectCurrentMosaic,
  setCollection,
  setCustomQueryBody,
  setMosaicQuery,
  setRenderOption,
} from "pages/Explore/state/mosaicSlice";
import { IStacCollection } from "types/stac";
import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { updateQueryStringParam } from "pages/Explore/utils";
import { useSearchIdMetadata } from "pages/Explore/utils/hooks/useSearchIdMetadata";
import { filterCoreExpressions } from "pages/Explore/utils/cql/helpers";

const collectionKey = "d";
export const mosaicQsKey = "m";
export const renderQsKey = "r";
export const customQueryQsKey = "q";

interface INamedObject {
  name: string | null;
}

const useUrlState = (
  options: INamedObject[] | undefined | null,
  stateKey: "query" | "renderOption",
  renderKey: "d" | "m" | "r",
  actionCreator: Function
) => {
  const dispatch = useExploreDispatch();
  const mosaic = useExploreSelector(selectCurrentMosaic);
  const currentState = mosaic[stateKey];

  // Set local state any initial render option specified in the URL
  const [qsValue, setQsValue] = useState<string | null>(
    new URLSearchParams(window.location.search).get(renderKey)
  );

  // Sync current option to query string. This does not cause further state changes
  useEffect(() => {
    if (currentState) {
      updateQueryStringParam(renderKey, currentState?.name);
    }
  }, [currentState, renderKey]);

  // When the options change, check to see if we've loaded the option
  // provided from the querystring. If not, use it. State is cleared after use
  // so the query string no longer feeds state changes, it's is only synced for copy/reload.
  useEffect(() => {
    if (options && qsValue) {
      const option = options.find(m => m.name === qsValue);
      if (option) {
        dispatch(actionCreator(option));
      }
      setQsValue(null);
    }
  }, [dispatch, qsValue, options, actionCreator]);
};

export const useRenderUrlState = (
  renderOptions: IMosaicRenderOption[] | null | undefined
) => {
  useUrlState(renderOptions, "renderOption", renderQsKey, setRenderOption);
};

export const useMosaicUrlState = (mosaics: IMosaic[] | null | undefined) => {
  useUrlState(mosaics, "query", mosaicQsKey, setMosaicQuery);
};

export const useCustomQueryUrlState = () => {
  const dispatch = useExploreDispatch();
  const [qsSearchId, setQsSearchId] = useState<string | null>(
    useQueryString().get(customQueryQsKey)
  );
  const { isCustomQuery, query } = useExploreSelector(selectCurrentMosaic);

  // TODO: handle failure
  const { data: searchMetadata, isSuccess } = useSearchIdMetadata(qsSearchId);

  useEffect(() => {
    if (isCustomQuery) {
      updateQueryStringParam(customQueryQsKey, query.searchId);
      updateQueryStringParam(mosaicQsKey, null);
    }

    return () => {
      updateQueryStringParam(customQueryQsKey, null);
    };
  }, [query.searchId, isCustomQuery]);

  useEffect(() => {
    if (searchMetadata && isSuccess) {
      // TODO: handle queries that can't be parsed (e.g. not created by Explorer)
      const queryInfo: IMosaic = {
        cql: filterCoreExpressions(searchMetadata.search.filter.args),
        sortby: null, // TODO: use searchMetadata.orderby but convert to CQL format.
        name: "Custom",
        description: "Set via query string",
        searchId: searchMetadata.hash,
      };
      dispatch(setCustomQueryBody(queryInfo));
      setQsSearchId(null);
    }
  }, [dispatch, searchMetadata, isSuccess]);
};

export const useCollectionUrlState = (collections: IStacCollection[] | null) => {
  const dispatch = useExploreDispatch();
  const qsCollectionId = useQueryString().get(collectionKey);
  const { collection } = useExploreSelector(selectCurrentMosaic);

  useEffect(() => {
    updateQueryStringParam(collectionKey, collection?.id);
  }, [collection]);

  useEffect(() => {
    if (collections && qsCollectionId) {
      const qsCollection = collections.find(c => c.id === qsCollectionId);
      if (qsCollection) {
        dispatch(setCollection(qsCollection));
      }
    }
  }, [collections, qsCollectionId, dispatch]);
};
