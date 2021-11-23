import StacFields from "@radiantearth/stac-fields";
import DOMPurify from "dompurify";
import marked from "marked";
import { capitalize } from ".";
import NewTabLink from "../components/controls/NewTabLink";
import SimpleKeyValueList from "../components/controls/SimpleKeyValueList";
import Revealer from "../components/Revealer";

const codeNumberList = value => <code>{`[${value.join(", ")}]`}</code>;
const fixedPct = value => {
  const n = Number(value);
  if (Number.isInteger(n)) {
    return `${n}%`;
  }
  return value.toFixed(2) + "%";
};

const fixedDeg = value => value.toFixed(2) + "°";

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

StacFields.Registry.addMetadataField("attrs", {
  label: "Attributes",
  formatter: value => value,
});

StacFields.Registry.addMetadataField("label:classes", {
  label: "Classes",
  formatter: value => {
    const v = Array.isArray(value) ? value[0] : value;
    return v.classes.join(", ");
  },
});

StacFields.Registry.addMetadataField("eo:cloud_cover", {
  label: "Cloud Cover",
  formatter: fixedPct,
});

StacFields.Registry.addMetadataField("proj:epsg", {
  label: "EPSG Code",
  formatter: value => (
    <NewTabLink href={`https://epsg.io/?q=${value}`}>{value}</NewTabLink>
  ),
});
StacFields.Registry.addMetadataField("proj:transform", {
  formatter: codeNumberList,
});
StacFields.Registry.addMetadataField("proj:bbox", {
  label: "Bounding Box",
  formatter: codeNumberList,
});
StacFields.Registry.addMetadataField("proj:shape", {
  formatter: codeNumberList,
});
StacFields.Registry.addMetadataField("proj:wkt2", {
  label: "WKT2",
  formatter: value => <code>{value}</code>,
});

StacFields.Registry.addMetadataField("sat:relative_orbit", {
  label: "Relative Orbit No.",
});

StacFields.Registry.addMetadataField("s2:mgrs_tile", {
  label: "MGRS Tile",
});

StacFields.Registry.addMetadataField("view:off_nadir", {
  label: "Off-Nadir Angle",
  formatter: fixedDeg,
});
StacFields.Registry.addMetadataField("view:sun_azimuth", {
  label: "Sun Azimuth",
  formatter: fixedDeg,
});
StacFields.Registry.addMetadataField("view:sun_elevation", {
  label: "Sun Elevation",
  formatter: fixedDeg,
});

StacFields.Registry.addMetadataField("table:storage_options", {
  formatter: value => <SimpleKeyValueList object={value} />,
});

StacFields.Registry.addMetadataField("label:description", {
  label: "Description",
  formatter: value => value,
});

StacFields.Registry.addMetadataField("sci:doi", {
  label: "DOI",
  formatter: value => (
    <NewTabLink href={`https://doi.org/${value}`}>{value}</NewTabLink>
  ),
});

StacFields.Registry.addMetadataField("landsat:wrs_row", {
  label: "WRS Row",
});
StacFields.Registry.addMetadataField("landsat:wrs_path", {
  label: "WRS Path",
});
StacFields.Registry.addMetadataField("landsat:wrs_type", {
  label: "WRS Type",
});
StacFields.Registry.addMetadataField("landsat:cloud_cover_land", {
  formatter: fixedPct,
});

StacFields.Registry.addMetadataField("naip:state", {
  formatter: value => value && value.toUpperCase(),
});
export const mediaTypeOverride = value => {
  switch (value) {
    case "image/tiff; application=geotiff; profile=cloud-optimized":
      return "GeoTIFF (COG)";
    case "application/x-parquet":
      return "Parquet";
    default:
      return StacFields.Formatters.formatMediaType(value);
  }
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

export const cubeColumOrders = [
  "name",
  "type",
  "description",
  "unit",
  "dimensions",
  "shape",
  "chunks",
  "attrs",
];

export const tableColumnOrders = ["name", "description", "type"];

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

  if (!fieldContent || !Object.keys(fieldContent).length) {
    return null;
  }

  // Add tooltips to potentially long cells
  switch (column.key) {
    case "asset":
      // Assets are generally rendered as a link to download a file. However, Zarr types
      // are really a root directory, and the href is more important than a link
      return fieldContent.contentType === "application/vnd+zarr" ? (
        <code title={fieldContent.name}>{fieldContent.href}</code>
      ) : (
        <NewTabLink href={fieldContent.href}>{fieldContent.name}</NewTabLink>
      );
    case "name":
      return <span title={fieldContent}>{fieldContent}</span>;
    case "title":
    case "type":
    case "roles":
      return <span title={fieldContent}>{capitalize(fieldContent)}</span>;
    case "attrs":
      return (
        <Revealer>
          <SimpleKeyValueList object={fieldContent} />
        </Revealer>
      );
    case "dimensions":
    case "shape":
    case "chunks":
      return <span>({fieldContent})</span>;
    case "description":
      return (
        <span
          title={fieldContent}
          dangerouslySetInnerHTML={{
            __html: capitalize(
              DOMPurify.sanitize(
                marked.parseInline(fieldContent || "", {
                  smartypants: true,
                })
              )
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
