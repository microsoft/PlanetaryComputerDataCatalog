import React from "react";
import StacFields from "@radiantearth/stac-fields";
import { Stack } from "@fluentui/react";

const ItemAssets = itemAssets => {
  const formatted = StacFields.formatAssets(itemAssets);
  const f = formatted.itemAssets.map(group => {
    return Object.entries(group.properties).map(([key, val]) => {
      return (
        <div
          style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
          dangerouslySetInnerHTML={{ __html: val.formatted }}
        />
      );
    });
  });

  return (
    <>
      <h3>Assets</h3>
      <Stack>{f}</Stack>
    </>
  );
};

export default ItemAssets;
