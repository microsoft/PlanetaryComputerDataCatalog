import { QueryFunctionContext, useQuery } from "react-query";
import $RefParser, { JSONSchema } from "@apidevtools/json-schema-ref-parser";

export const useCollectionQueryables = (collectionId: string | undefined) => {
  return useQuery(["queryable", collectionId], getCollectionQueryables, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: Boolean(collectionId),
  });
};

const getCollectionQueryables = async (
  queryParam: QueryFunctionContext<["queryable", string | undefined]>
): Promise<JSONSchema> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, collectionId] = queryParam.queryKey;

  const schema = await $RefParser.dereference(
    `/stac/${collectionId}/queryables.json`
  );

  return schema;
};
