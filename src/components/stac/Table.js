// for the table extension
import { DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";

import { useStac } from "./CollectionContext";
import { renderItemColumn, stacFormatter } from "../../utils/stac";

const defaultWidth = 95;
const tableColumnWidths = {
  name: 150,
  description: 400,
};

const columnColumnWidths = {
  title: 150,
  description: 400,
  type: 55,
};

const TableTable = ({ stacKey, title, description }) => {
  const tableTables = useStac()[stacKey];
  if (!tableTables) return null;

  // Get a set of unique attributes for each dimension, these will be columns.
  // The list is modified to include/remove keys in the table
  const columnKeys = ["name", "description"];
  const columns = columnKeys.map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: tableColumnWidths[key] || defaultWidth,
      maxWidth: tableColumnWidths[key] || defaultWidth,
      fieldName: key,
      isResizable: true,
      isPadded: true,
      isMultiline: true,
    };
  });

  const details = (
    <DetailsList
      items={tableTables}
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
      <p>{description}</p>
      {details}
    </div>
  );
};

const ColumnTable = ({ stacKey, title, description }) => {
  const tableColumns = useStac()[stacKey];
  if (!tableColumns) return null;

  // Get a set of unique attributes for each dimension, these will be columns.
  // The list is modified to include/remove keys in the table
  const columnKeys = ["name", "description", "type"];
  const columns = columnKeys.map(key => {
    return {
      key: key,
      name: stacFormatter.label(key),
      minWidth: columnColumnWidths[key] || defaultWidth,
      maxWidth: columnColumnWidths[key] || defaultWidth,
      fieldName: key,
      isResizable: true,
      isPadded: true,
      isMultiline: true,
    };
  });

  const details = (
    <DetailsList
      items={tableColumns}
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
      <p>{description}</p>
      {details}
    </div>
  );
};

export const TableTables = () => {
  return (
    <TableTable
      stacKey="table:tables"
      title="Tables"
      description="The dataset includes the following tables."
    />
  );
};

export const TableColumns = () => {
  return (
    <ColumnTable
      stacKey="table:columns"
      title="Columns"
      description="Each table includes the following columns."
    />
  );
};

export default TableTable;
