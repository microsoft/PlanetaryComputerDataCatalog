import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { ICqlExpressionList } from "pages/Explore/utils/cql/types";

export type ChatMessage = {
  id: string;
  timestamp: string;
  text: string;
  isUser: boolean;
  canRender: boolean;
  hasLayers: boolean;
  layers?: ChatLayerState[];
  collectionIds?: string[];
};

export type ChatLayer = {
  collectionId: string;
  cql: ICqlExpressionList;
  renderOptionName: string;
  canRender: boolean;
};

export type ChatLayerState = {
  collectionId: string;
  mosaic: IMosaic;
  renderOption?: IMosaicRenderOption;
  canRender: boolean;
};

export type BaseChatResponse = {
  id: string;
  success: boolean;
  response: string;
  map?: {
    center: [number, number];
    zoom: number;
  };
};

export type ServerChatResponse = BaseChatResponse & {
  layers: ChatLayer[];
};

export type StateChatResponse = BaseChatResponse & {
  layers: ChatLayerState[];
  collectionIds: string[];
};
