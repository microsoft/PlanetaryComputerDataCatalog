import { DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";

import {
  bandOverrideList,
  columnOrders,
  mediaTypeOverride,
  rasterBandOverrideList,
  renderItemColumn,
  stacFormatter,
} from "../../utils/stac";
import { sortByLookup } from "../../utils";
import { useStac } from "./CollectionContext";

// The list component does not size columns to fit content. We need to set min
// and max widths in order to set an initial size. Based on a known set of
// values, set the desired widths by key
const defaultWidth = 100;
const columnWidths = {
  title: 200,
  gsd: 30,
  roles: 50,
  description: 100,
};

const ItemAssets = () => {
  const { item_assets: itemAssets } = useStac();

  if (!itemAssets) return null;

  const formatted = stacFormatter.formatAssets(itemAssets);

  // Get a unique list of asset properties, which will become columns. Add a
  // special "key" column which will hold the asset key from the asset object.
  const columnKeys = Array.from(
    new Set(
      Object.values(formatted)
        .map(extensions => {
          return extensions.map(({ properties }) => Object.keys(properties)).flat();
        })
        .flat()
    )
  ).concat(["stac_key"]);

  // Use specified, consistent ordering for columns
  columnKeys.sort(sortByLookup(columnOrders));

  const columns = columnKeys.map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnWidths[key] || defaultWidth,
      maxWidth: columnWidths[key] || defaultWidth,
      fieldName: key,
      isResizable: true,
      isPadded: true,
      isMultiline: true,
    };
  });

  // Make the rows
  const items = Object.entries(formatted).map(([assetKey, extensions]) => {
    // Flatten all extension property attributres to a single list
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
            case "raster:bands":
              // HOTFIX: can remove in trunk
              formattedValue = rasterBandOverrideList(property.value);
              break;
            case "type":
              // Shorten COG GeoTIFF type
              formattedValue = mediaTypeOverride(property.value);
              break;
            default:
              // Just use the default format
              formattedValue = property.formatted;
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
