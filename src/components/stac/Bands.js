import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";
import StacFields from "@radiantearth/stac-fields";

const bandKey = "eo:bands";

StacFields.Registry.addMetadataField("gsd", {
  label: "GSD",
  formatter: value => (value ? `${value}m` : "-"),
});

// The list component does not size columns to fit content. We need to set min
// and max widths in order to set an initial size. Based on a known set of
// values, set the desired widths by key
const defaultWidth = 50;
const columnWidths = {
  common_name: 100,
  center_wavelength: 150,
  full_width_half_max: 75,
  description: 100,
};

const Bands = ({ collection }) => {
  const summaries = StacFields.formatSummaries(collection);
  const eo = summaries.find(s => s.extension === "eo");

  // eo:bands not present, don't render a band section
  if (!eo) return null;

  const bands = eo.properties[bandKey];

  const columns = bands.itemOrder.map((key, idx) => {
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

  const items = bands.value.map(band => {
    const formattedEntries = Object.keys(band).map(key => {
      const spec = bands.spec.items[key];
      return [key, `${band[key]} ${spec.unit ?? ""}`];
    });
    return Object.fromEntries(formattedEntries);
  });

  return (
    <>
      <h2>Spectral Bands</h2>
      <DetailsList
        items={items}
        compact={false}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
      />
    </>
  );
};

export default Bands;
