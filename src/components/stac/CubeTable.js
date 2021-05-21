import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";

import { useStac } from "./CollectionContext";
import { renderItemColumn, stacFormatter } from "../../utils/stac";

const defaultWidth = 100;
const columnWidths = {
  title: 150,
  description: 300,
};

const CubeTable = ({ stacKey, title }) => {
  const dims = useStac()[stacKey];
  if (!dims) return null;

  // Get a set of unique attributes for each dimension, these will be columns.
  // Add the key of the object as the "name" column.
  const columnKeys = ["name"].concat(
    Array.from(new Set(Object.values(dims).map(Object.keys).flat()))
  );

  const columns = columnKeys.map((key, idx) => {
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

  const items = Object.entries(dims).map(([key, values]) => {
    return { name: key, ...values };
  });

  const details = (
    <DetailsList
      items={items}
      compact={false}
      columns={columns}
      selectionMode={SelectionMode.none}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={true}
      onRenderItemColumn={renderItemColumn}
    />
  );

  return (
    <div style={{ marginTop: 40 }}>
      <h3>{title}</h3>
      {details}
    </div>
  );
};

export const CubeDimensions = () => {
  return <CubeTable stacKey="cube:dimensions" title="Dimensions" />;
};

export const CubeVariables = () => {
  return <CubeTable stacKey="cube:variables" title="Variables" />;
};

export default CubeTable;
