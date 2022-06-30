import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";
import StacFields from "@radiantearth/stac-fields";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { isEmpty, isNil, isObject } from "lodash-es";

import { capitalize, toUtcDateWithTime } from ".";
import NewTabLink from "../components/controls/NewTabLink";
import SimpleKeyValueList from "../components/controls/SimpleKeyValueList";
import Revealer from "../components/Revealer";
import AssetDetails from "components/stac/AssetDetails";

const stringList = value => {
  return Array.isArray(value) ? value.map(capitalize).join(", ") : capitalize(value);
};

const codeNumberList = value => <code>{`[${value.join(", ")}]`}</code>;

const fixedPct = value => {
  const n = Number(value);
  if (Number.isInteger(n)) {
    return `${n}%`;
  }
  return value.toFixed(2) + "%";
};

const fixedDeg = value => value.toFixed(2) + "°";
const upperCase = value => value.toUpperCase();
const meters = value => (value ? `${value} m` : "—");

StacFields.Registry.addAssetField("roles", {
  label: "Roles",
  formatter: stringList,
});

StacFields.Registry.addMetadataField("datetime", {
  formatter: value => (value ? toUtcDateWithTime(value) : "n/a"),
});

StacFields.Registry.addMetadataField("gsd", {
  label: "GSD",
  formatter: meters,
});

StacFields.Registry.addMetadataField("spatial_resolution", {
  formatter: meters,
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

StacFields.Registry.addMetadataField("raster:bands", {
  label: "Raster Info",
  formatter: value => {
    const values = Array.isArray(value) ? value : [value];
    return values.map((band, idx) => {
      const key = Object.entries(band)[0][1];
      return (
        <Stack key={`bandwrapper-${key}-${idx}`}>
          <Text
            as="h4"
            styles={{ root: { fontWeight: 600, fontSize: "14px", margin: "2px 0" } }}
          >
            Raster Band {idx + 1}
          </Text>
          <div style={{ paddingLeft: 4 }}>
            <SimpleKeyValueList
              key={`rasterband-${key}-${idx}`}
              object={band}
              indent={true}
            />
          </div>
        </Stack>
      );
    });
  },
});

StacFields.Registry.addMetadataField("file:values", {
  label: "File Values",
  formatter: fileValues => {
    const items = fileValues.map(v => {
      const code = v.values.join(",");
      const desc = v.summary;
      return { code, desc };
    });
    return (
      <DetailsList
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        compact={true}
        columns={[
          {
            key: "code",
            name: "Code",
            fieldName: "code",
            isMultiline: false,
            isPadded: false,
            maxWidth: 35,
            minWidth: 10,
          },
          { key: "desc", name: "Description", fieldName: "desc", isMultiline: true },
        ]}
        items={items}
      />
    );
  },
});

StacFields.Registry.addMetadataField("classification:classes", {
  label: "Classification",
  formatter: fileValues => {
    const items = fileValues.map(v => {
      const code = v.value;
      const desc = v.description;
      return { code, desc };
    });
    return (
      <DetailsList
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        compact={true}
        columns={[
          {
            key: "code",
            name: "Code",
            fieldName: "code",
            isMultiline: false,
            isPadded: false,
            maxWidth: 35,
            minWidth: 10,
          },
          { key: "desc", name: "Description", fieldName: "desc", isMultiline: true },
        ]}
        items={items}
      />
    );
  },
});

StacFields.Registry.addMetadataField("classification:bitfields", {
  label: "Classfication Bitfields",
  formatter: fileValues => {
    return fileValues.map(v => {
      return (
        <Stack key={`bitfield-${v.name}`} tokens={gap4}>
          <Stack horizontal tokens={gap4}>
            <Text styles={boldStyle}>{capitalize(v.name)}</Text>
            <Text>{v.description}</Text>
          </Stack>
          <Stack horizontal tokens={gap4}>
            <StackItem>Offset: {v.offset}, </StackItem>
            <StackItem>Length: {v.length}</StackItem>
          </Stack>
          <DetailsList
            styles={{ root: { paddingBottom: 10 } }}
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            compact={true}
            columns={[
              {
                key: "name",
                name: "Name",
                fieldName: "name",
                isMultiline: false,
                isPadded: false,
                maxWidth: 55,
                minWidth: 10,
              },
              {
                key: "value",
                name: "Value",
                fieldName: "value",
                isMultiline: false,
                isPadded: false,
                maxWidth: 35,
                minWidth: 10,
              },
              {
                key: "description",
                name: "Description",
                fieldName: "description",
                isMultiline: false,
              },
            ]}
            items={v.classes}
          />
        </Stack>
      );
    });
  },
});

StacFields.Registry.addMetadataField("label:classes", {
  label: "Classes",
  formatter: value => {
    const v = Array.isArray(value) ? value[0] : value;
    return v.classes.join(", ");
  },
});
StacFields.Registry.addMetadataField("label:properties", {
  label: "Label Properties",
  formatter: value => (value ? value : "Raster data"),
});
StacFields.Registry.addMetadataField("label:description", {
  label: "Label Description",
});

StacFields.Registry.addMetadataField("eo:cloud_cover", {
  label: "Cloud Cover",
  formatter: fixedPct,
});

StacFields.Registry.addMetadataField("proj:epsg", {
  label: "EPSG Code",
  formatter: value => {
    const values = Array.isArray(value) ? value : [value];
    return values.map((value, idx) => (
      <NewTabLink key={`epsg-${idx}`} href={`https://epsg.io/?q=${value}`}>
        {value}
      </NewTabLink>
    ));
  },
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
StacFields.Registry.addMetadataField("proj:geometry", {
  formatter: value => <code>{JSON.stringify(value)}</code>,
});
StacFields.Registry.addMetadataField("proj:projjson", {
  formatter: value => <code>{JSON.stringify(value)}</code>,
});

StacFields.Registry.addMetadataField("sar:center_frequency", {
  formatter: value => (value ? `${value} GHz` : "—"),
});
StacFields.Registry.addMetadataField("sar:resolution_range", {
  formatter: meters,
});
StacFields.Registry.addMetadataField("sar:resolution_azimuth", {
  formatter: meters,
});
StacFields.Registry.addMetadataField("sar:pixel_spacing_range", {
  formatter: meters,
});
StacFields.Registry.addMetadataField("sar:pixel_spacing_azimuth", {
  formatter: meters,
});
StacFields.Registry.addMetadataField("sar:looks_equivalent_number", {
  label: "Equivalent Number of Looks",
});

StacFields.Registry.addMetadataField("sat:orbit_state", {
  formatter: capitalize,
});
StacFields.Registry.addMetadataField("sat:relative_orbit", {
  label: "Relative Orbit No.",
});
StacFields.Registry.addMetadataField("sat:absolute_orbit", {
  label: "Absolute Orbit No.",
});
StacFields.Registry.addMetadataField("sat:platform_international_designator", {
  label: "Platform Designator",
});

StacFields.Registry.addMetadataField("cmip6:model", {
  label: "CMIP6 model",
});

StacFields.Registry.addMetadataField("cmip6:variable", {
  label: "CMIP6 variable",
});

StacFields.Registry.addMetadataField("cmip6:scenario", {
  label: "CMIP6 scenario",
});

StacFields.Registry.addMetadataField("cmip6:Conventions", {
  label: "Convention version",
});
StacFields.Registry.addMetadataField("cmip6:activity_id", {
  label: "Activity  identifier(s)",
});
StacFields.Registry.addMetadataField("cmip6:creation_date", {
  label: "Date file was created",
});
StacFields.Registry.addMetadataField("cmip6:data_specs_version", {
  label: "Version identifier",
});
StacFields.Registry.addMetadataField("cmip6:experiment", {
  label: "Short experiment description",
});
StacFields.Registry.addMetadataField("cmip6:experiment_id", {
  label: "Root experiment identifier",
});
StacFields.Registry.addMetadataField("cmip6:forcing_index", {
  label: "Index for variant of forcing",
});
StacFields.Registry.addMetadataField("cmip6:frequency", {
  label: "Sampling frequency",
});
StacFields.Registry.addMetadataField("cmip6:further_info_url", {
  label: "Location of documentation",
});
StacFields.Registry.addMetadataField("cmip6:grid", { label: "Grid" });
StacFields.Registry.addMetadataField("cmip6:grid_label", {
  label: "Grid identifier",
});
StacFields.Registry.addMetadataField("cmip6:initialization_index", {
  label: "Index for variant of initialization method",
});
StacFields.Registry.addMetadataField("cmip6:institution", {
  label: "Institution name",
});
StacFields.Registry.addMetadataField("cmip6:institution_id", {
  label: "Institution identifier",
});
StacFields.Registry.addMetadataField("cmip6:license", {
  label: "License restrictions",
});
StacFields.Registry.addMetadataField("cmip6:mip_era", {
  label: "Activity's associated CMIP cycle",
});
StacFields.Registry.addMetadataField("cmip6:nominal_resolution", {
  label: "Approximate horizontal resolution",
});
StacFields.Registry.addMetadataField("cmip6:physics_index", {
  label: "Index for model physics variant",
});
StacFields.Registry.addMetadataField("cmip6:product", {
  label: "Product type (part of DRS) ",
});
StacFields.Registry.addMetadataField("cmip6:realization_index", {
  label: "Realization number",
});
StacFields.Registry.addMetadataField("cmip6:realm", {
  label: "Realm(s) where variable is defined",
});
StacFields.Registry.addMetadataField("cmip6:source", {
  label: "Full model name / version",
});
StacFields.Registry.addMetadataField("cmip6:source_id", {
  label: "Model identifier",
});
StacFields.Registry.addMetadataField("cmip6:source_type", {
  label: "Model configuration ",
});
StacFields.Registry.addMetadataField("cmip6:sub_experiment", {
  label: "Description of sub-experiment ",
});
StacFields.Registry.addMetadataField("cmip6:sub_experiment_id", {
  label: "Sub-experiment identifier",
});
StacFields.Registry.addMetadataField("cmip6:table_id", {
  label: "Table identifier",
});
StacFields.Registry.addMetadataField("cmip6:tracking_id", {
  label: "Unique file identifier",
});
StacFields.Registry.addMetadataField("cmip6:variable_id", {
  label: "Variable identifier",
});
StacFields.Registry.addMetadataField("cmip6:variant_label", {
  label: "'Variant' label",
});

StacFields.Registry.addMetadataField("deltares:sea_level_year", {
  formatter: String,
});

StacFields.Registry.addMetadataField("goes:image-type", {
  label: "Image Type",
});
StacFields.Registry.addMetadataField("goes:mode", {
  label: "GOES Mode",
});
StacFields.Registry.addMetadataField("goes:processing-level", {
  label: "Processing Level",
});

StacFields.Registry.addMetadataField("s1:shape", {
  formatter: codeNumberList,
});

StacFields.Registry.addMetadataField("s2:mgrs_tile", {
  label: "MGRS Tile",
});
StacFields.Registry.addMetadataField("s2:mean_solar_zenith", {
  formatter: fixedDeg,
});
StacFields.Registry.addMetadataField("s2:mean_solar_azimuth", {
  formatter: fixedDeg,
});
StacFields.Registry.addMetadataField("s2:unclassified_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:water_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:snow_ice_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:vegetation_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:thin_cirrus_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:cloud_shadow_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:nodata_pixel_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:dark_features_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:not_vegetated_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:medium_proba_clouds_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:saturated_defective_pixel_percentage", {
  formatter: fixedPct,
});
StacFields.Registry.addMetadataField("s2:degraded_msi_data_percentage", {
  formatter: fixedPct,
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

StacFields.Registry.addMetadataField("ecmwf:reference_times", {
  label: "Reference time",
});
StacFields.Registry.addMetadataField("ecmwf:streams", {
  label: "ECMWF stream",
  formatter: upperCase,
});
StacFields.Registry.addMetadataField("ecmwf:types", {
  label: "ECMWF model type",
  formatter: upperCase,
});
StacFields.Registry.addMetadataField("ecmwf:pressure_levels", {
  label: "Pressure levels",
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
      return name ? `${name} ${common}`.trim() : common_name;
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
  asset_details: 1001,
};

export const cubeColumOrders = [
  "name",
  "type",
  "description",
  "unit",
  "dimensions",
  "shape",
  "chunks",
  "cell_methods",
  "cell_measures",
  "comments",
  "long_name",
];

export const tableColumnOrders = ["name", "description", "type"];

export const getRelativeSelfPath = links => {
  const href = links.find(l => l.rel === "self").href;
  const url = new URL(href);
  return url.pathname;
};

export const renderItemColumn = (item, _, column) => {
  let fieldContent =
    column.fieldName === "asset_details" ? item : item[column.fieldName];

  if (isNil(fieldContent)) return "–";
  if (isObject(fieldContent) && isEmpty(fieldContent)) return "–";

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
    case "title":
    case "type":
    case "roles":
      if (Array.isArray(fieldContent)) {
        fieldContent = fieldContent.join(", ");
      }
      return <span title={fieldContent}>{capitalize(fieldContent)}</span>;
    case "attrs":
      return (
        <Revealer>
          <SimpleKeyValueList object={fieldContent} />
        </Revealer>
      );
    case "dimensions":
      if (Array.isArray(fieldContent)) {
        fieldContent = fieldContent.join(", ");
      }
      return <span>({fieldContent})</span>;
    case "shape":
    case "chunks":
      if (Array.isArray(fieldContent)) {
        fieldContent = fieldContent
          .map(v => {
            return isNil(v) ? "varies" : v;
          })
          .join(", ");
      }
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
    case "asset_details":
      return <AssetDetails asset={item} />;

    default:
      if (Array.isArray(fieldContent)) {
        fieldContent = fieldContent.join(", ");
      }
      return stacFormatter.format(fieldContent, column.fieldName);
  }
};

const boldStyle = { root: { fontWeight: "bold" } };
const gap4 = { childrenGap: 4 };
