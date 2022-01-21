import stringify from "json-stringify-pretty-compact";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/github.css";

import { IStacFilter, IStacItem } from "types/stac";
import { STAC_URL } from "utils/constants";
import { stripCommonFilterElements } from "./helpers";

hljs.registerLanguage("python", python);

export const createCqlPythonSnippet = (cql: IStacFilter | undefined) => {
  if (!cql) return null;

  const templateValue = stripCommonFilterElements(cql);
  if (!templateValue) return null;

  const { aoi, datetime, fullBody } = templateValue;

  const placeholderBody = stringify({ op: "and", args: fullBody });
  const body = placeholderBody
    .replace(aoi.replace.this, aoi.replace.with)
    .replace(datetime.replace.this, datetime.replace.with);

  // Datetime expression is optional, only include the variable assignment if it exists
  const datetimeAssignment = datetime.exp
    ? `
# Define your temporal range
daterange = ${stringify(datetime.value)}
`
    : "";

  const template = `from pystac_client import Client
import planetary_computer as pc

# Search against the Planetary Computer STAC API
catalog = Client.open(
  "${STAC_URL}"
)

# Define your area of interest
aoi = ${stringify(aoi.value)}
${datetimeAssignment}
# Define your search with CQL2 syntax
search = catalog.search(filter_lang="cql2-json", filter=${body})

# Grab the first item from the search results and sign the assets
first_item = next(search.get_items())
pc.sign_item(first_item).assets`;

  return hljs.highlight(template, { language: "python" });
};

export const createItemPythonSnippet = (item: IStacItem | null) => {
  if (!item) return null;

  const itemLink = item.links.find(link => link.rel === "self");
  if (!itemLink) return null;

  let dataAssetEntries = Object.entries(item.assets).filter(
    ([_, asset]) => asset.roles?.includes("data") && asset.type?.includes("geotiff")
  );
  if (!dataAssetEntries?.length) {
    dataAssetEntries = Object.entries(item.assets).filter(([_, asset]) =>
      asset.type?.includes("geotiff")
    );
  }

  const [firstDataAsset, ...otherDataAssets] = dataAssetEntries;

  // Generate a comment indicating other data assets that might be useful
  const formattedOtherAssets = otherDataAssets?.length
    ? `(other asset keys to use: ${otherDataAssets
        .map(a => `'${a[0]}'`)
        .join(", ")})`
    : "";

  const template = `import pystac
import planetary_computer
import rioxarray

item_url = "${itemLink.href}"

# Load the individual item metadata and sign the assets
item = pystac.Item.from_file(item_url)
signed_item = planetary_computer.sign(item)

# Open one of the data assets ${formattedOtherAssets}
asset_href = signed_item.assets["${firstDataAsset[0]}"].href
ds = rioxarray.open_rasterio(asset_href)
ds
`;

  return hljs.highlight(template, { language: "python" });
};
