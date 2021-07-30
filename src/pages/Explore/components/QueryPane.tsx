import { useCallback, useEffect, useState } from "react";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { QueryContext } from "./query/context";
import Builder from "./query/Builder";

// import { MQE_URL } from "../../utils/constants";

interface QueryPaneProps {
  collectionId: string;
}

const QueryPane = ({ collectionId }: QueryPaneProps) => {
  const [schema, setSchema] = useState<any>();

  const fetchSchema = useCallback(async () => {
    setSchema(null);
    // TODO: replace mock queryables
    const schema = await $RefParser.dereference(
      `/mock/${collectionId}/queryables.json`
    );
    setSchema(schema);
  }, [collectionId]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  console.log(schema);

  return schema ? (
    <QueryContext.Provider value={{ state: { schema } }}>
      <Builder />
    </QueryContext.Provider>
  ) : (
    <div>Filtering not enabled for this collection</div>
  );
};

export default QueryPane;
