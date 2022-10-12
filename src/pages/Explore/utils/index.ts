import { centerKey, zoomKey } from "../components/Map/hooks/useUrlState";
import {
  QS_ACTIVE_EDIT_KEY,
  QS_COLLECTION_KEY,
  QS_MOSAIC_KEY,
  QS_RENDER_KEY,
  QS_SORT_KEY,
  QS_V1_CUSTOM_KEY,
  QS_VERSION_KEY,
} from "../components/Sidebar/selectors/hooks/useUrlStateV2";

export const resetMosaicQueryStringState = () => {
  [
    QS_COLLECTION_KEY,
    QS_MOSAIC_KEY,
    QS_RENDER_KEY,
    QS_SORT_KEY,
    QS_ACTIVE_EDIT_KEY,
    QS_VERSION_KEY,
    QS_V1_CUSTOM_KEY,
  ].map(key => updateQueryStringParam(key, ""));
};

export const updateQueryStringParam = (
  key: string,
  value: string | undefined | null
) => {
  const url = new URL(window.location.href);
  const existing = url.searchParams.get(key);

  // Update or remove the query string param
  if (value && existing !== value) {
    url.searchParams.set(key, value);
  } else if (!value && existing) {
    url.searchParams.delete(key);
  } else {
    return;
  }
  window.history.replaceState({}, "", url.toString());
};

export const getCenterAndZoomQueryString = (): {
  center: [number, number] | undefined;
  zoom: number | undefined;
} => {
  const qs = new URL(window.location.href).searchParams;
  const center = qs.get(centerKey)?.split(",").map(Number);
  const zoom = qs.get(zoomKey);

  return {
    center: center ? [center[0], center[1]] : undefined,
    zoom: zoom ? Number(zoom) : undefined,
  };
};
