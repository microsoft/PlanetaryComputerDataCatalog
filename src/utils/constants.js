const apiRoot = process.env.REACT_APP_API_ROOT;
const tilerRoot = process.env.REACT_APP_TILER_ROOT || process.env.REACT_APP_API_ROOT;

// In some environments, there is a one-off URL for the STAC API that doesn't
//conform to the otherwise expected path layout
export const STAC_URL = apiRoot.endsWith("stac")
  ? apiRoot
  : `${apiRoot}/api/stac/v1`;

export const SAS_URL = apiRoot.endsWith("stac")
  ? apiRoot.replace("stac", "sas")
  : `${apiRoot}/api/sas/v1`;

export const DATA_URL = apiRoot.endsWith("stac")
  ? tilerRoot.replace("stac", "data")
  : `${tilerRoot}/api/data/v1`;

export const AUTH_STAC_URL = "/api/px/stac/v1";
export const AUTH_DATA_URL = "/api/px/data/v1";

export const HUB_URL = process.env.REACT_APP_HUB_URL || "";

export const getStacUrl = isLoggedIn => {
  return isLoggedIn ? AUTH_STAC_URL : STAC_URL;
};

export const getDataUrl = isLoggedIn => {
  return isLoggedIn ? AUTH_DATA_URL : DATA_URL;
};
