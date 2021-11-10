import { useEffect, useState } from "react";

import { useQueryString } from "utils/hooks";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import {
  setCollection,
  setMosaicQuery,
  setRenderOption,
} from "pages/Explore/state/mosaicSlice";
import { IStacCollection } from "types/stac";
import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { updateQueryStringParam } from "pages/Explore/utils";

const collectionKey = "d";
export const mosaicQsKey = "m";
export const renderQsKey = "r";
export const customQueryQsKey = "q";

export const useRenderUrlState = (
  renderOptions: IMosaicRenderOption[] | null | undefined
) => {
  const dispatch = useExploreDispatch();
  const currentOption = useExploreSelector(state => state.mosaic.renderOption);

  // Set local state any initial render option specified in the URL
  const [qsValue, setQsValue] = useState<string | null>(
    new URLSearchParams(window.location.search).get(renderQsKey)
  );

  // Sync current option to query string. This does not cause further state changes.
  useEffect(() => {
    if (currentOption) {
      updateQueryStringParam(renderQsKey, currentOption?.name);
    }
  }, [currentOption]);

  // When the options change, check to see if we've loaded the option
  // provided from the querystring. If not, use it. State is cleared after use
  // so the query string no longer feeds state changes, it's is only synced for copy/reload.
  useEffect(() => {
    if (renderOptions && qsValue) {
      const option = renderOptions.find(o => o.name === qsValue);
      if (option) {
        dispatch(setRenderOption(option));
      }
      setQsValue(null);
    }
  }, [dispatch, qsValue, renderOptions]);
};

export const useMosaicUrlState = (mosaics: IMosaic[] | null | undefined) => {
  // useUrlState(mosaics, "query", mosaicQsKey, setMosaicQuery);
  const dispatch = useExploreDispatch();
  const { query, customQuery, isCustomQuery } = useExploreSelector(
    state => state.mosaic
  );
  const qsParams = new URLSearchParams(window.location.search);

  // Is there a custom query in the URL?
  const hasCustomQuery = qsParams.has(customQueryQsKey);
  const hasMosaicQs = qsParams.has(mosaicQsKey);

  // Set local state any initial render option specified in the URL
  const [qsValue, setQsValue] = useState<string | null>(qsParams.get(mosaicQsKey));
  console.log(qsValue);

  // Sync current option to query string. This does not cause further state changes.
  useEffect(() => {
    if (isCustomQuery && customQuery.searchId) {
      updateQueryStringParam(customQueryQsKey, customQuery.searchId);
      updateQueryStringParam(mosaicQsKey, "");
    } else if (!isCustomQuery) {
      updateQueryStringParam(customQueryQsKey, "");
      updateQueryStringParam(mosaicQsKey, query.name);
    }
  }, [customQuery.searchId, isCustomQuery, query.name]);

  // When the options change, check to see if we've loaded the option
  // provided from the querystring. If not, use it. State is cleared after use
  // so the query string no longer feeds state changes, it's is only synced for copy/reload.
  useEffect(() => {
    if (mosaics && qsValue) {
      const query = mosaics?.find(o => o.name === qsValue);
      if (query) {
        dispatch<any>(setMosaicQuery(query));
      }
      setQsValue(null);
    }
  }, [dispatch, mosaics, qsValue]);
};

export const useCollectionUrlState = (collections: IStacCollection[] | null) => {
  const dispatch = useExploreDispatch();
  const qsCollectionId = useQueryString().get(collectionKey);
  const { collection } = useExploreSelector(state => state.mosaic);

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
