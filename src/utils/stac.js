export const getRelativeSelfPath = links => {
  const href = links.find(l => l.rel === "self").href;
  const url = new URL(href);
  return url.pathname;
};

export const renderItemColumn = (item, _, column) => {
  const fieldContent = item[column.fieldName];

  // Add tooltips to potentiall long cells
  switch (column.key) {
    case "title":
    case "name":
    case "type":
    case "description":
      return <span title={fieldContent}>{fieldContent}</span>;
    default:
      return fieldContent;
  }
};
