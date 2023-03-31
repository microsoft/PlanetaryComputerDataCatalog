import { IMosaic, IMosaicRenderOption } from "pages/Explore/types";
import { ICqlExpressionList } from "pages/Explore/utils/cql/types";

export type ChatMessage = {
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

export type ChatResponse = {
  text: string;
  layers: ChatLayer[];
  map: {
    center: [number, number];
    zoom: number;
  };
};

export type ChatLayerState = {
  collectionId: string;
  mosaic: IMosaic;
  renderOption: IMosaicRenderOption;
};

export type ChatResponseWithLayerState = {
  text: string;
  layers: ChatLayerState[];
  map: {
    center: [number, number];
    zoom: number;
  };
};
