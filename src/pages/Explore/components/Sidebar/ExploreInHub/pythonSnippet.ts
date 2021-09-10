import stringify from "json-stringify-pretty-compact";
import { IStacFilter } from "types/stac";

const createPythonSnippet = (cql: IStacFilter | undefined) => {
  if (!cql) return null;

  const pythonDict = stringify(cql.filter);

  return `from pystac_client import Client
import planetary_computer as pc

catalog = Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")
search = catalog.search(filter=${pythonDict})

search.get_items()`;
};

export default createPythonSnippet;
