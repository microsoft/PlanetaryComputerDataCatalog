import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";

import {
  columnOrders,
  renderItemColumn,
  stacFormatter,
} from "../../utils/stac";
import { useStac } from "./CollectionContext";
import marked from "marked";
import { capitalize, sortByLookup } from "../../utils";

const bandKey = "eo:bands";

// The list component does not size columns to fit content. We need to set min
// and max widths in order to set an initial size. Based on a known set of
// values, set the desired widths by key
const defaultWidth = 50;
const columnWidths = {
  name: 75,
  common_name: 100,
  center_wavelength: 125,
  full_width_half_max: 90,
  description: 100,
};

const Bands = () => {
  const collection = useStac();
  const summaries = stacFormatter.formatSummaries(collection);
  const eo = summaries.find(s => s.extension === "eo");

  // eo:bands not present, don't render a band section
  if (!eo) return null;

  const bands = eo.properties[bandKey];

  bands.itemOrder.sort(sortByLookup(columnOrders));

  const columns = bands.itemOrder.map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnWidths[key] || defaultWidth,
      maxWidth: columnWidths[key] || defaultWidth,
      fieldName: key,
      isResizable: true,
      isPadded: true,
      isMultiline: key === "description",
    };
  });

  const items = bands.value.map(band => {
    const formattedEntries = Object.keys(band).map(key => {
      const spec = bands.spec.items[key];
      const formattedVal =
        spec.format === "CommonMark"
          ? marked.parseInline(capitalize(band[key]), { smartypants: true })
          : band[key];
      return [key, `${formattedVal} ${spec.unit ?? ""}`];
    });
    return Object.fromEntries(formattedEntries);
  });

  return (
    <div>
      <h3>Spectral Bands</h3>
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

export default Bands;
