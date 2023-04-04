import { AxiosInstance } from "axios";
import { IMosaic } from "pages/Explore/types";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { fetchCollectionMosaicInfo } from "pages/Explore/utils/hooks/useCollectionMosaicInfo";
import { QueryFunctionContext, useQuery } from "react-query";
import { registerStacFilter } from "utils/requests";
import {
  ChatLayerState,
  ChatMessage,
  ServerChatResponse,
  StateChatResponse,
} from "./types";

import { useAuthApiClient } from "components/auth/hooks/useApiClient";
import { uniqueId } from "lodash-es";

export const useChatApi = (message: ChatMessage | undefined, history: any) => {
  const client = useAuthApiClient();
  const id = `chat-message-${message?.id}`;

  return useQuery([id, message?.text, []], getChat, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(message?.text),
    meta: { client },
  });
};

const getChat = async (
  queryContext: QueryFunctionContext<
    [string, string | undefined, string[] | undefined]
  >
): Promise<{ enriched: StateChatResponse; raw: any }> => {
  const [, message, history] = queryContext.queryKey;
  const client = queryContext.meta?.client as AxiosInstance;
  const { data: response } = await client.post<ServerChatResponse>("/chat", {
    input: message,
    history,
  });

  const collectionIds = response.layers.map(l => l.collectionId);
  const renderableLayers = response.layers.filter(l => l.canRender);

  const mosaicInfos = await Promise.all(
    renderableLayers.map(async l => {
      return await fetchCollectionMosaicInfo(l.collectionId);
    })
  );

  const mosaics: IMosaic[] = renderableLayers.map(l => {
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
        renderableLayers[i].collectionId,
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

  const layerStates: ChatLayerState[] = renderableLayers.map((l, i) => {
    const renderOption = mosaicInfos[i].renderOptions?.find(
      r => r.name === l.renderOptionName
    );

    if (!renderOption) {
      console.warn(`Render option not found ${l.renderOptionName}`);
    }

    return {
      collectionId: l.collectionId,
      mosaic: enrichedMosaics[i],
      renderOption: renderOption,
      canRender: l.canRender,
    };
  });

  const enriched = {
    ...response,
    id: uniqueId("bot_"),
    layers: layerStates,
    collectionIds: collectionIds,
  };

  return {
    enriched,
    raw: response,
  };
};
