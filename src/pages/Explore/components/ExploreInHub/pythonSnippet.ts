import stringify from "json-stringify-pretty-compact";
import { IStacFilter, IStacItem } from "types/stac";

export const createCqlPythonSnippet = (cql: IStacFilter | undefined) => {
  if (!cql) return null;

  const pythonDict = stringify(cql.filter);

  return `from pystac_client import Client
import planetary_computer as pc

catalog = Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")
search = catalog.search(filter=${pythonDict})

search.get_items()`;
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

  return `import pystac
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
};
