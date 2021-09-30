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
  const currentState = useExploreSelector(state => state.mosaic[stateKey]);

  // Set local state any initial render option specified in the URL
  const [qsValue, setQsValue] = useState<string | null>(
    new URLSearchParams(window.location.search).get(renderKey)
  );

  // Sync current option to query string. This does not cause further state changes.
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
