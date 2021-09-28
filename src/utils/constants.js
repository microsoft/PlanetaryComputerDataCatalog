const root = process.env.REACT_APP_API_ROOT;

// In some environments, there is a one-off URL for the STAC API that doesn't
//conform to the otherwise expected path layout
export const STAC_URL = root.endsWith("stac") ? root : `${root}/api/stac/v1`;
export const SAS_URL = root.endsWith("stac")
  ? root.replace("stac", "sas")
  : `${root}/api/sas/v1`;
export const DATA_URL = root.endsWith("stac")
  ? root.replace("stac", "data")
  : `${root}/api/data/v1`;
export const HUB_URL = process.env.REACT_APP_HUB_URL || "";
