const apiRoot =
  process.env.REACT_APP_API_ROOT ||
  "https://planetarycomputer-staging.microsoft.com";
const tilerRoot = process.env.REACT_APP_TILER_ROOT || apiRoot;

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

export const IMAGE_URL = process.env.REACT_APP_IMAGE_API_ROOT || "";
export const HUB_URL = process.env.REACT_APP_HUB_URL || "";
export const AUTH_URL = process.env.REACT_APP_AUTH_URL || apiRoot;

export const X_REQUEST_ENTITY = "X-PC-Request-Entity";
export const QS_REQUEST_ENTITY = "request_entity";
export const REQUEST_ENTITY = "explorer";
