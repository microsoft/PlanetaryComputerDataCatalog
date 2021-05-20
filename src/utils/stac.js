import StacFields from "@radiantearth/stac-fields";
import DOMPurify from "dompurify";
import marked from "marked";
import { capitalize } from ".";

StacFields.Registry.addMetadataField("gsd", {
  label: "GSD",
  formatter: value => (value ? `${value} m` : "-"),
});

StacFields.Registry.addMetadataField("description", {
  label: "Description",
  formatter: value =>
    marked.parseInline(capitalize(value) || "", { smartypants: true }),
});

StacFields.Registry.addMetadataField("stac_key", {
  label: "STAC Key",
  formatter: value => value,
});

export const mediaTypeOverride = value => {
  if (value === "image/tiff; application=geotiff; profile=cloud-optimized") {
    return "GeoTIFF (COG)";
  }

  return StacFields.Formatters.formatMediaType(value);
};

export const bandOverrideList = bands => {
  return bands
    .map(({ name, common_name }) => {
      const common = common_name ? `(${common_name})` : "";
      return `${name} ${common}`.trim();
    })
    .join(", ");
};

export const stacFormatter = StacFields;

// Use for consistent column orders across table types
export const columnOrders = {
  title: 0,
  name: 1,
  common_name: 2,
  stac_key: 5,
  roles: 10,
  type: 20,
  gsd: 30,
  "eo:bands": 40,
  description: 100,
};

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
    case "roles":
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
    case "stac_key":
      return <code title={fieldContent}>{fieldContent}</code>;
    default:
      return fieldContent;
  }
};
