import { useEffect } from "react";

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
const mosaicKey = "m";
const renderKey = "r";

export const useRenderUrlState = (
  renderOptions: IMosaicRenderOption[] | undefined | null
) => {
  const qs = useQueryString();
  const dispatch = useExploreDispatch();
  const qsRender = qs.get(renderKey);

  const { renderOption } = useExploreSelector(state => state.mosaic);

  useEffect(() => {
    updateQueryStringParam(renderKey, renderOption?.name);
  }, [renderOption]);

  useEffect(() => {
    if (renderOptions && qsRender) {
      const option = renderOptions.find(m => m.name === qsRender);
      if (option) {
        dispatch(setRenderOption(option));
      }
    }
  }, [dispatch, renderOptions, qsRender]);
};

export const useMosaicUrlState = (mosaics: IMosaic[] | undefined) => {
  const qs = useQueryString();
  const dispatch = useExploreDispatch();
  const qsMosaic = qs.get(mosaicKey);

  const { query } = useExploreSelector(state => state.mosaic);

  useEffect(() => {
    updateQueryStringParam(mosaicKey, query.name);
  }, [query.name]);

  useEffect(() => {
    if (mosaics && qsMosaic) {
      const mosaic = mosaics.find(m => m.name === qsMosaic);
      if (mosaic) {
        dispatch(setMosaicQuery(mosaic));
      }
    }
  }, [dispatch, mosaics, qsMosaic]);
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
