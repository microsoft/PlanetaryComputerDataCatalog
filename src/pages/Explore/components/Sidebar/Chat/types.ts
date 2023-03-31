import { Feature, GeoJsonProperties, Polygon } from "geojson";
import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { ICqlExpressionList } from "pages/Explore/utils/cql/types";

export type ChatMessage = {
  id: string;
  timestamp: string;
  text: string;
  isUser: boolean;
};

export type ChatLayer = {
  collectionId: string;
  searchId?: string;
  cql: ICqlExpressionList;
  renderOptionName: string;
  renderOption?: IMosaicRenderOption;
};

export type ChatLayerState = {
  collectionId: string;
  mosaic: IMosaic;
  renderOption: IMosaicRenderOption;
};

export type BaseChatResponse = {
  id: string;
  success: boolean;
  response: string;
  boundary: Feature<Polygon, GeoJsonProperties>;
};

export type ServerChatResponse = BaseChatResponse & {
  layers: ChatLayer[];
};

export type StateChatResponse = BaseChatResponse & {
  layers: ChatLayerState[];
};
