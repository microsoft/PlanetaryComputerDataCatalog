import { centerKey, zoomKey } from "../components/Map/hooks/useUrlState";

export const updateQueryStringParam = (
  key: string,
  value: string | undefined | null
) => {
  const url = new URL(window.location.href);
  const existing = url.searchParams.get(key);

  if (value && existing !== value) {
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url.toString());
  }
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
