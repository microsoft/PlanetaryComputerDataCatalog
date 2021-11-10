import { centerKey, zoomKey } from "../components/Map/hooks/useUrlState";
import {
  renderQsKey,
  mosaicQsKey,
  customQueryQsKey,
} from "../components/Sidebar/selectors/hooks/useUrlState";

export const resetMosaicQueryStringState = () => {
  updateQueryStringParam(renderQsKey, "");
  updateQueryStringParam(mosaicQsKey, "");
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

export const getIsCustomQueryString = () => {
  const qs = new URL(window.location.href).searchParams;
  return qs.has(customQueryQsKey);
};
