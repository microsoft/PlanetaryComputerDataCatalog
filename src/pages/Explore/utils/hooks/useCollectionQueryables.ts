import { QueryFunctionContext, useQuery } from "react-query";
import $RefParser, { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { STAC_URL } from "utils/constants";

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
  const [, collectionId] = queryParam.queryKey;

  const schema = await $RefParser.dereference(
    `${STAC_URL}/collections/${collectionId}/queryables`
  );

  return schema;
};
