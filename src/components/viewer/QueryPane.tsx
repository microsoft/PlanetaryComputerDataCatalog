import { useCallback, useEffect, useState } from "react";
import $RefParser from "@apidevtools/json-schema-ref-parser";

// import { MQE_URL } from "../../utils/constants";

interface QueryPaneProps {
  collectionId: string;
}

const QueryPane = ({ collectionId }: QueryPaneProps) => {
  const [schema, setSchema] = useState<any>();

  const fetchSchema = useCallback(async () => {
    let schema = await $RefParser.dereference(
      `http://localhost:8866/api/stac/v1/collections/${collectionId}/queryables`
    );
    setSchema(schema);
  }, [collectionId]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  console.log(schema);

  return <pre>{JSON.stringify(schema, null, 2)}</pre>;
};

export default QueryPane;
