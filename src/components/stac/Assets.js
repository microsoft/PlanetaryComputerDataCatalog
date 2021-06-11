import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";

import { useStac } from "./CollectionContext";
import { renderItemColumn } from "../../utils/stac";
import { titleCase } from "../../utils";

const columnWidths = {
  asset: 300,
  content_type: 75,
  roles: 75,
  description: 200,
};

const Assets = () => {
  const { assets } = useStac();

  const columnNames = ["asset", "description", "roles", "content_type"];

  const columns = columnNames.map(key => {
    return {
      key: key,
      name: titleCase(key.replace(/_/, " ")),
      minWidth: columnWidths[key],
      maxWidth: columnWidths[key],
      fieldName: key.toLowerCase(),
      isResizable: true,
      isPadded: true,
      isMultiline: true,
    };
  });

  const items = Object.keys(assets)
    .map(key => {
      const asset = assets[key];
      return {
        asset: { name: asset.title, href: asset.href },
        key: key,
        description: asset.description,
        roles: asset?.roles?.join(", "),
        content_type: asset.type,
      };
    })
    .filter(item => item.key !== "thumbnail");

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Dataset Files</h3>
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
