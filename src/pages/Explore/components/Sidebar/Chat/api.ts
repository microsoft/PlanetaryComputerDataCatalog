import axios from "axios";
import { IMosaic } from "pages/Explore/types";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { fetchCollectionMosaicInfo } from "pages/Explore/utils/hooks/useCollectionMosaicInfo";
import { QueryFunctionContext, useQuery } from "react-query";
import { registerStacFilter } from "utils/requests";
import { ChatLayerState, ServerChatResponse, StateChatResponse } from "./types";

const CHAT_API_URL = true
  ? "https://httpbin.org/delay/2"
  : "https://func-pct-gpt-westeurope-staging.azurewebsites.net/api/ai/v1/chat";

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
): Promise<StateChatResponse> => {
  const [, message] = queryParam.queryKey;
  const { data } = await axios.post<ServerChatResponse>(CHAT_API_URL, message);

  let response: ServerChatResponse;
  if (message?.toLowerCase().includes("bio")) {
    response = fakeMessages[1];
  } else if (message?.toLowerCase().includes("climate")) {
    response = fakeMessages[0];
  } else {
    response = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
  }

  const collectionIds = response.layers.map(l => l.collectionId);

  const mosaicInfos = await Promise.all(
    collectionIds.map(async id => {
      return await fetchCollectionMosaicInfo(id);
    })
  );

  const mosaics: IMosaic[] = response.layers.map(l => {
    const cqlClean = l.cql.filter(
      exp => new CqlExpressionParser(exp).property !== "collection"
    );
    return {
      name: "Suggested",
      cql: cqlClean,
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
    ...response,
    layers: layerStates,
  };
};

const fakeMessages: ServerChatResponse[] = [
  {
    id: "123-34-3432",
    success: true,
    response:
      "Sentinel-2 L2A is a satellite product that provides global, high-resolution, and atmospherically corrected images of the Earth’s surface. It can be used to monitor various environmental features and changes related to climate change.\n\nIt has a high temporal and spectral coverage and resolution compared to other satellite products.",
    layers: [
      {
        collectionId: "sentinel-2-l2a",
        cql: [{ op: "<=", args: [{ property: "eo:cloud_cover" }, 10] }],
        renderOptionName: "Natural color",
      },
    ],
    boundary: {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [3.3874172564356115, 6.67813593752345],
            [3.310465585040191, 6.727587854895134],
            [3.292359309418032, 6.759054637989294],
            [3.2154076380226115, 6.7455691240407845],
            [3.265199895983443, 6.475780984361137],
            [3.3919438253411442, 6.5027663880180455],
            [3.3874172564356115, 6.67813593752345],
          ],
        ],
        type: "Polygon",
      },
    },
  },
  {
    id: "9328-423-234",
    success: true,
    response:
      "Chloris Biomass is a planetary computer product that provides global, annual, and CO2-equivalent estimates of aboveground biomass for woody vegetation ecosystems. It covers the period from 2003 to 2019 with a spatial resolution of about 4.6 km. It is available under a Creative Common license for non-commercial use.",
    layers: [
      {
        collectionId: "chloris-biomass",
        cql: [
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
    boundary: {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [-70.76350637661093, -1.8609123212856815],
            [-70.76350637661093, -11.973776197745195],
            [-59.60373614807622, -11.973776197745195],
            [-59.60373614807622, -1.8609123212856815],
            [-70.76350637661093, -1.8609123212856815],
          ],
        ],
        type: "Polygon",
      },
    },
  },
];
