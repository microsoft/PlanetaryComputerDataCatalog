import StacFields from "@radiantearth/stac-fields";
import DOMPurify from "dompurify";
import marked from "marked";

StacFields.Registry.addMetadataField("gsd", {
  label: "GSD",
  formatter: value => (value ? `${value} m` : "-"),
});

export const stacFormatter = StacFields;

export const getRelativeSelfPath = links => {
  const href = links.find(l => l.rel === "self").href;
  const url = new URL(href);
  return url.pathname;
};

export const renderItemColumn = (item, _, column) => {
  let fieldContent = item[column.fieldName];

  if (Array.isArray(fieldContent)) {
    fieldContent = fieldContent.join(", ");
  }

  // Add tooltips to potentially long cells
  switch (column.key) {
    case "title":
    case "name":
    case "type":
      return <span title={fieldContent}>{fieldContent}</span>;
    case "description":
      return (
        <span
          title={fieldContent}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parseInline(fieldContent || "", {
                smartypants: true,
              })
            ),
          }}
        />
      );
    default:
      return fieldContent;
  }
};
