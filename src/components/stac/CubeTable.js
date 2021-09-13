import React from "react";
import { DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";

import { useStac } from "./CollectionContext";
import { cubeColumOrders, renderItemColumn, stacFormatter } from "../../utils/stac";
import { sortByPosition } from "../../utils";

const defaultWidth = 95;
const columnWidths = {
  title: 150,
  description: 200,
  type: 55,
  attrs: 200,
};

const CubeTable = ({ stacKey, title }) => {
  const dims = useStac()[stacKey];
  if (!dims) return null;

  // Get a set of unique attributes for each dimension, these will be columns.
  // The list is modified to include/remove keys in the table
  const removeList = ["reference_system"];
  const addList = ["name"];
  const columnKeys = addList.concat(
    Array.from(
      new Set(
        Object.values(dims)
          .map(Object.keys)
          .flat()
          .filter(k => !removeList.includes(k))
      )
    )
  );

  const columns = columnKeys.sort(sortByPosition(cubeColumOrders)).map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnWidths[key] || defaultWidth,
      maxWidth: columnWidths[key] || defaultWidth,
      fieldName: key,
      isResizable: true,
      isPadded: true,
      isMultiline: ["name", "description", "attrs"].includes(key),
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
