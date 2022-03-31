import { DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";

import {
  bandOverrideList,
  columnOrders,
  mediaTypeOverride,
  renderItemColumn,
  stacFormatter,
} from "../../utils/stac";
import { sortByLookup } from "../../utils";
import { useStac } from "./CollectionContext";
import { IStacExtension } from "types/stac";

// The list component does not size columns to fit content. We need to set min
// and max widths in order to set an initial size. Based on a known set of
// values, set the desired widths by key
const defaultWidth = 100;
const columnWidths: Record<string, { min?: number; max?: number }> = {
  title: { min: 100, max: 300 },
  gsd: { max: 30 },
  roles: { max: 70 },
  stac_key: { max: 150 },
  type: { max: 100 },
  "eo:bands": { max: 100 },
};

export const ASSET_DETAIL_KEYS = [
  "file:values",
  "raster:bands",
  "classification:classes",
];

const ItemAssets = () => {
  const collection = useStac();
  if (!collection) return null;

  const { item_assets: itemAssets } = collection;

  const formatted: Record<string, IStacExtension[]> =
    stacFormatter.formatAssets(itemAssets);

  // Get a unique list of asset properties, which will become columns. Add a
  // special "key" column which will hold the asset key from the asset object.
  let columnKeys = Array.from(
    new Set(
      Object.values(formatted)
        .map(extensions => {
          return extensions.map(getKeysFromExtension).flat();
        })
        .flat()
    )
  ).concat(["stac_key"]);

  // Special keys which can be long or many-to-one with an asset get plucked out
  // and ultimately rendered in a detail pane. Remove these keys, and if they existed
  // replace them with a synthetic key "asset_details". This key is later used to render
  // any possible "detail" keys removed here.
  const hasDetails = ASSET_DETAIL_KEYS.some(key => columnKeys.includes(key));

  if (hasDetails) {
    columnKeys = columnKeys.filter(key => !ASSET_DETAIL_KEYS.includes(key));
    columnKeys.push("asset_details");
  }

  // Use specified, consistent ordering for columns
  columnKeys.sort(sortByLookup(columnOrders));

  const columns = columnKeys.map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnWidths[key]?.min || defaultWidth,
      maxWidth: columnWidths[key]?.max || undefined,
      fieldName: key,
      isResizable: true,
      isPadded: true,
      isMultiline: true,
    };
  });

  // Make the rows
  const items = Object.entries(formatted).map(([assetKey, extensions]) => {
    // Flatten all extension property attributes to a single list
    const item = extensions
      .map(({ properties }) => {
        return Object.entries(properties).map(([key, property]) => {
          // Allow for overriding specific values of various property types
          let formattedValue;
          switch (key) {
            case "eo:bands":
              // Rather than a table, render a string of "name (common name)" bands
              formattedValue = bandOverrideList(property.value);
              break;
            case "type":
              // Shorten COG GeoTIFF type
              formattedValue = mediaTypeOverride(property.value);
              break;
            default:
              // Just use the default format
              formattedValue = property.value;
          }
          return [key, formattedValue];
        });
      })
      .flat();

    // Make a new object with all asset attributes, including the key of the asset
    return { stac_key: assetKey, ...Object.fromEntries(item) };
  });

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Item-level Assets</h3>
      <p>Dataset items contain the following assets.</p>
      <DetailsList
        items={items}
        compact={false}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        onRenderItemColumn={renderItemColumn}
      />
    </div>
  );
};

export default ItemAssets;

const getKeysFromExtension = ({ properties }: IStacExtension) => {
  return Object.keys(properties);
};
