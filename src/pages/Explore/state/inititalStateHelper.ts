import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { isEmpty, uniqueId } from "lodash-es";

import { fetchTileJson, registerStacFilter } from "utils/requests";
import {
  deserializeSettings,
  QS_COLLECTION_KEY,
  QS_CUSTOM_PREFIX,
  QS_MOSAIC_KEY,
  QS_RENDER_KEY,
  QS_SEPARATOR,
  QS_SETTINGS_KEY,
  QS_V1_CUSTOM_KEY,
  QS_VERSION_KEY,
} from "../components/Sidebar/selectors/hooks/useUrlStateV2";
import { ILayerState, IMosaic, IMosaicInfo } from "../types";
import { updateQueryStringParam } from "../utils";
import {
  fetchCollection,
  fetchCollectionMosaicInfo,
} from "../utils/hooks/useCollectionMosaicInfo";
import { fetchSearchIdMetadata } from "../utils/hooks/useSearchIdMetadata";
import {
  initialMosaicState,
  setBulkLayers,
  setCurrentEditingLayerId,
} from "./mosaicSlice";

export const loadMosaicState = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const qs = new URLSearchParams(window.location.search);
  const version = qs.get(QS_VERSION_KEY);
  const v1CustomParam = qs.get(QS_V1_CUSTOM_KEY);

  if (!isEmpty(v1CustomParam)) {
    loadQsV1(v1CustomParam, dispatch);
  } else if (version === "2") {
    loadQsV2(dispatch);
  } else {
    // V2 is compatible with v1 if it does not have a the q param
    loadQsV2(dispatch);
  }
};

// Take a custom v1 query string and convert it to v2 loadable state
const loadQsV1 = (
  searchId: string | null,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const qs = new URLSearchParams(window.location.search);
  const collectionId = qs.get(QS_COLLECTION_KEY);
  const mosaicName = `${QS_CUSTOM_PREFIX}${searchId}`;
  const renderOptionName = qs.get(QS_RENDER_KEY);

  if (collectionId && mosaicName && renderOptionName) {
    loadMosaicStateV2(
      [collectionId],
      [mosaicName],
      [renderOptionName],
      [],
      dispatch
    );

    // Remove the v1 custom parameter
    updateQueryStringParam(QS_V1_CUSTOM_KEY, "");
  }
};

const loadQsV2 = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
  const qs = new URLSearchParams(window.location.search);
  const collectionIds = qs.get(QS_COLLECTION_KEY)?.split(QS_SEPARATOR) ?? [];
  const mosaicNames = qs.get(QS_MOSAIC_KEY)?.split(QS_SEPARATOR) ?? [];
  const renderOptionNames = qs.get(QS_RENDER_KEY)?.split(QS_SEPARATOR) ?? [];
  const settings = qs.get(QS_SETTINGS_KEY)?.split(QS_SEPARATOR) ?? [];

  loadMosaicStateV2(
    collectionIds,
    mosaicNames,
    renderOptionNames,
    settings,
    dispatch
  );
};

/**
 *  Loads the mosaic state from v2 query string params. All values are assumed to be
 *  sequenced in the same order, separated by `QS_SEPARATOR`.
 * @param collectionIds
 * @param mosaicNames Mosaic name from a mosaicInfo entry, or a cql:<searchid>
 * representing a custom search
 * @param renderOptionNames RenderOption name from a mosaicInfo entry
 * @param settings Layer specific settings: isPinned, opacity, isVisible
 * @param dispatch
 * @returns
 */
const loadMosaicStateV2 = async (
  collectionIds: string[],
  mosaicNames: string[],
  renderOptionNames: string[],
  settings: string[],
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const collections = await Promise.all(
    collectionIds.map(async id => {
      return await fetchCollection(id);
    })
  );

  const mosaicInfos = await Promise.all(
    collectionIds.map(async id => {
      return await fetchCollectionMosaicInfo(id);
    })
  ).catch(reason => {
    throw new Error(reason);
  });

  const layerEntries = await Promise.all(
    collections.map(async (collection, index): Promise<[string, ILayerState]> => {
      const config = deserializeSettings(settings[index]);
      const mosaicName = getDefaultMosaicName(
        mosaicNames[index],
        mosaicInfos[index]
      );
      const isCustomQuery = mosaicName.startsWith(QS_CUSTOM_PREFIX);
      const customSearchId = mosaicName.substring(QS_CUSTOM_PREFIX.length);
      const mosaic: IMosaic | undefined = isCustomQuery
        ? {
            ...initialMosaicState,
            searchId: customSearchId,
          }
        : mosaicInfos[index].mosaics.find(m => m.name === mosaicName);

      const renderOptionName = getDefaultRenderName(
        renderOptionNames[index],
        mosaicInfos[index]
      );
      const renderOption = mosaicInfos[index].renderOptions?.find(
        r => r.name === renderOptionName
      );

      if (!mosaic || !renderOption) {
        throw new Error("Invalid mosaic or render option");
      }

      // Register the cql to get the search Id, custom queries don't have
      // cql but already have a searchId
      const searchId = isCustomQuery
        ? customSearchId
        : await registerStacFilter(collection.id, mosaic, mosaic.cql, false);

      // Get the named mosaic's cql, or fetch the cql for a custom query's searchId
      const cql = isCustomQuery
        ? (await fetchSearchIdMetadata(searchId)).search.filter.args
        : mosaic.cql;

      const query = { ...mosaic, searchId, cql };

      // Fetch the minzoom from the tilejson endpoint for this collection/renderOption
      const minZoom = (await fetchTileJson(query, renderOption, collection)).minzoom;

      const layerId = uniqueId(collection.id);
      const layer: ILayerState = {
        layerId,
        collection,
        query,
        renderOption,
        isCustomQuery: isCustomQuery,
        isPinned: config.isPinned,
        layer: {
          minZoom: minZoom,
          maxExtent: [],
          opacity: config.opacity,
          visible: config.visible,
        },
      };
      return [layerId, layer];
    })
  ).catch(reason => {
    console.error(reason);
    throw new Error(reason);
  });

  const layers = Object.fromEntries(layerEntries);
  const layerOrder = Object.keys(layers).reverse();
  const activeLayerId = layerEntries.find(([, layer]) => !layer.isPinned)?.[0];
  dispatch(setBulkLayers({ layers, layerOrder }));

  // If there was a layer that was not pinned, make it the active one
  activeLayerId && dispatch(setCurrentEditingLayerId(activeLayerId));

  return false;
};

const getDefaultMosaicName = (
  mosaicName: string | undefined,
  mosaicInfo: IMosaicInfo
): string => {
  const defaultName = mosaicInfo.mosaics[0].name || "";
  return mosaicName ? mosaicName : defaultName;
};

const getDefaultRenderName = (
  renderName: string | undefined,
  mosaicInfo: IMosaicInfo
): string => {
  const defaultName = mosaicInfo.renderOptions?.[0].name || "";
  return renderName ? renderName : defaultName;
};
