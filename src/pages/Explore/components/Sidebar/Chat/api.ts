import { AxiosInstance } from "axios";
import { IMosaic } from "pages/Explore/types";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { fetchCollectionMosaicInfo } from "pages/Explore/utils/hooks/useCollectionMosaicInfo";
import { QueryFunctionContext, useQuery } from "react-query";
import { registerStacFilter } from "utils/requests";
import { ChatLayerState, ServerChatResponse, StateChatResponse } from "./types";

import { useAuthApiClient } from "components/auth/hooks/useApiClient";
import { uniqueId } from "lodash-es";

export const useChatApi = (message: string | undefined, history?: string[]) => {
  const client = useAuthApiClient();
  return useQuery(["chat-message", message, history], getChat, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(message),
    meta: { client },
  });
};

const getChat = async (
  queryContext: QueryFunctionContext<
    [string, string | undefined, string[] | undefined]
  >
): Promise<StateChatResponse> => {
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

  return {
    ...response,
    id: uniqueId("bot_"),
    layers: layerStates,
    collectionIds: collectionIds,
  };
};
