const root = process.env.REACT_APP_API_ROOT;

// In some environments, there is a one-off URL for the STAC API that doesn't
//conform to the otherwise expected path layout
export const MQE_URL = root.endsWith("stac") ? root : `${root}/api/stac/v1`;
export const DQE_URL = root.endsWith("stac")
  ? root
  : `${process.env.REACT_APP_API_ROOT}/api/sas/v1`;
