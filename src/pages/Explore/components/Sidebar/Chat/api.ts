import axios from "axios";
import { IMosaic } from "pages/Explore/types";
import { fetchCollectionMosaicInfo } from "pages/Explore/utils/hooks/useCollectionMosaicInfo";
import { QueryFunctionContext, useQuery } from "react-query";
import { registerStacFilter } from "utils/requests";
import {
  ChatLayer,
  ChatLayerState,
  ChatResponse,
  ChatResponseWithLayerState,
} from "./types";

const CHAT_API_URL = "https://httpbin.org/delay/4";

export const useChatApi = (message: string | undefined) => {
  return useQuery(["chat-message", message], getChat, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(message),
  });
};

const getChat = async (
  queryParam: QueryFunctionContext<[string, string | undefined]>
): Promise<ChatResponseWithLayerState> => {
  const [, message] = queryParam.queryKey;
  const { data } = await axios.post<ChatResponse>(CHAT_API_URL, message);

  const response = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];

  const collectionIds = response.layers.map(l => l.collectionId);

  const mosaicInfos = await Promise.all(
    collectionIds.map(async id => {
      return await fetchCollectionMosaicInfo(id);
    })
  );

  const mosaics: IMosaic[] = response.layers.map(l => {
    return {
      name: "Suggested",
      cql: l.cql,
      description: "Suggested by the Planetary Computer Chatbot",
      sortby: "desc",
    };
  });

  const enrichedMosaics = await Promise.all(
    mosaics.map(async (mosaic, i) => {
      const searchId = await registerStacFilter(
        collectionIds[i],
        mosaic,
        mosaic.cql,
        false
      );
      return {
        ...mosaic,
        searchId,
      };
    })
  );

  console.log(mosaicInfos);
  console.log(data);

  const layerStates: ChatLayerState[] = response.layers.map((l, i) => {
    const renderOption = mosaicInfos[i].renderOptions?.find(
      r => r.name === l.renderOptionName
    );

    if (!renderOption) {
      throw new Error(`Render option not found ${l.renderOptionName}`);
    }

    return {
      collectionId: l.collectionId,
      mosaic: enrichedMosaics[i],
      renderOption: renderOption,
    };
  });

  return {
    text: response.text,
    layers: layerStates,
    map: response.map,
  };
};

const fakeMessages: ChatResponse[] = [
  {
    text: "Chloris biomass is a vegetation index that measures the aboveground biomass of a plant. It is calculated by dividing the red band by the near-infrared band. The index is sensitive to the amount of chlorophyll in the plant. The index is useful for monitoring the growth of plants and for estimating the amount of biomass in a given area.",
    layers: [
      { collectionId: "sentinel-2-l2a", cql: [], renderOptionName: "Natural Color" },
    ],
    map: {
      center: [-45, 70],
      zoom: 5,
    },
  },
  {
    text: "Hello. This is a fake response",
    layers: [
      {
        collectionId: "chloris-biomass",
        cql: [
          { op: "=", args: [{ property: "collection" }, "chloris-biomass"] },
          {
            op: "anyinteracts",
            args: [
              { property: "datetime" },
              { interval: ["2013-08-01", "2014-01-01"] },
            ],
          },
        ],

        renderOptionName: "Aboveground Biomass (tonnes)",
      },
    ],
    map: {
      center: [-45, 70],
      zoom: 5,
    },
  },
];
