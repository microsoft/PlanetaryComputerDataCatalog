// for the table extension
import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";

import { useStac } from "./CollectionContext";
import {
  tableColumnOrders,
  renderItemColumn,
  stacFormatter,
} from "../../utils/stac";
import { sortByPosition } from "../../utils";

const defaultWidth = 95;
const columnWidths = {
  title: 150,
  description: 400,
  type: 55,
};

const TableTable = ({ stacKey, title }) => {
  const table_columns = useStac()[stacKey];
  if (!table_columns) return null;

  // Get a set of unique attributes for each dimension, these will be columns.
  // The list is modified to include/remove keys in the table
  const columnKeys = ["name", "description", "type"]

  const columns = columnKeys.sort(sortByPosition(tableColumnOrders)).map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnWidths[key] || defaultWidth,
      maxWidth: columnWidths[key] || defaultWidth,
      fieldName: key,
      isResizable: true,
      isPadded: true,
      isMultiline: ["description"].includes(key),
    };
  });

  const items = Object.entries(table_columns).map(([key, values]) => {
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

export const TableColumns = () => {
  return <TableTable stacKey="table:columns" title="Columns" />;
};

export default TableTable;
