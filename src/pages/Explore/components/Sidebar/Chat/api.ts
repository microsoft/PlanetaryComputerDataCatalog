import axios from "axios";
import { QueryFunctionContext, useQuery } from "react-query";

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
) => {
  const [, message] = queryParam.queryKey;
  const { data } = await axios.post(CHAT_API_URL, message);
  console.log(data);
  return "Hello. This is a fake response";
};
