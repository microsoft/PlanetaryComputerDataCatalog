import atlas, { ResourceType } from "azure-maps-control";
import { DATA_URL, REQUEST_ENTITY, X_REQUEST_ENTITY } from "utils/constants";

// Add request entity header to all tiler requests
export const addEntityHeader = (
  url: string,
  resourceType: ResourceType
): atlas.RequestParameters => {
  if (resourceType === "Tile" && url?.startsWith(DATA_URL)) {
    return {
      headers: {
        [X_REQUEST_ENTITY]: REQUEST_ENTITY,
      },
    };
  }
  return {};
};

// const addAuthHeaders = (
//   url: string,
//   resourceType: atlas.ResourceType
// ): atlas.RequestParameters => {
//   resourceType === "Tile" && console.log(url, resourceType, DATA_URL);
//   if (resourceType === "Tile" && url?.startsWith(DATA_URL)) {
//     return { headers: { Authorization: `Bearer ${sessionStatus.token}` } };
//   }
//   return {};
// };
