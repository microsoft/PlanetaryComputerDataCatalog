import { DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";

import { useStac } from "./CollectionContext";
import { renderItemColumn, stacFormatter } from "../../utils/stac";

const columnWidths = {
  asset: 300,
  content_type: 75,
  stac_key: 150,
  roles: 75,
  description: 300,
};

const Assets = () => {
  const { assets } = useStac();

  const columnNames = ["asset", "stac_key", "description", "roles", "content_type"];

  const columns = columnNames.map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnWidths[key],
      maxWidth: columnWidths[key],
      fieldName: key.toLowerCase(),
      isResizable: true,
      isPadded: true,
      isMultiline: true,
    };
  });

  const items = Object.keys(assets || {})
    .map(key => {
      const asset = assets[key];
      return {
        asset: { name: asset.title, href: asset.href, contentType: asset.type },
        stac_key: key,
        description: asset.description,
        roles: asset?.roles?.join(", "),
        content_type: asset.type,
      };
    })
    .filter(item => item.stac_key !== "thumbnail");

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Dataset Assets</h3>
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

export default Assets;
