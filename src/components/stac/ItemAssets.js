import React from "react";
import StacFields from "@radiantearth/stac-fields";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";

import { renderItemColumn } from "../../utils/stac";

// The list component does not size columns to fit content. We need to set min
// and max widths in order to set an initial size. Based on a known set of
// values, set the desired widths by key
const defaultWidth = 100;
const columnWidths = {
  title: 150,
  gsd: 30,
  description: 100,
};

const bandKey = "eo:bands";

const ItemAssets = itemAssets => {
  const formatted = StacFields.formatAssets(itemAssets);

  if (!itemAssets) return null;

  // Item assets will be grouped by extension
  const assetsByExt = formatted.itemAssets.map(ia => {
    // Get a list of all unique value keys for assets in this extension, these
    // will become column headers
    const columnKeys = Array.from(
      new Set(
        Object.values(ia.properties)
          .map(asset => Object.keys(asset.value))
          .flat()
      )
    );

    // Create objects with keys matching the column keys above.
    const items = Object.values(ia.properties).map(({ value }) => {
      // Convert arrays to joined strings, unless there is special handling for
      // certain keys defined.
      const skipFormat = [bandKey];

      const entries = Object.entries(value).map(([key, val]) => {
        if (typeof va === Array && !skipFormat.includes(key)) {
          return [key, val.join(", ")];
        }
        return [key, StacFields.format(val, key)];
      });

      // eo:bands are concatanated specially
      const formattedBands = value[bandKey]
        ? value[bandKey]
            .map(({ name, common_name }) => {
              const common = common_name ? `(${common_name})` : "";
              return `${name} ${common}`.trim();
            })
            .join(", ")
        : null;

      // Reassemble an item object for the list
      if (formattedBands) {
        entries.push([bandKey, formattedBands]);
      }

      return Object.fromEntries(entries);
    });

    // An extension has a label, column keys, and a list of item objects
    // pre-formatted
    return { sectionLabel: ia.label, columnKeys, items };
  });

  const assetLists = assetsByExt.map(
    ({ sectionLabel, columnKeys, items }, idx) => {
      const columns = columnKeys.map((key, idx) => {
        return {
          key: key,
          name: StacFields.label(key),
          minWidth: columnWidths[key] || defaultWidth,
          maxWidth: columnWidths[key] || defaultWidth,
          fieldName: key,
          isRowHeader: idx > 0 ? false : true,
          isResizable: true,
          isPadded: true,
        };
      });

      return (
        <section key={`assetlist-${idx}`}>
          {sectionLabel && <h3>{sectionLabel}</h3>}
          <DetailsList
            items={items}
            compact={false}
            columns={columns}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onRenderItemColumn={renderItemColumn}
          />
        </section>
      );
    }
  );

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Dataset Assets</h3>
      {assetLists}
    </div>
  );
};

export default ItemAssets;
