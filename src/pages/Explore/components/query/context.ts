import React from "react";
import { QueryableState } from "./state";

export const QueryContext = React.createContext<{ state: QueryableState }>({
  state: { schema: { properties: {} } },
});
