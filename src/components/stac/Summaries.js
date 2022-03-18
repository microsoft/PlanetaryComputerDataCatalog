import React from "react";
import StacFields from "@radiantearth/stac-fields";
import LabeledValue from "../controls/LabeledValue";

const CollectionSummary = ({ collection }) => {
  const skipSummaries = ["sci:doi", "eo:bands"];
  const summaries = collection
    ? StacFields.formatSummaries(collection, key => !skipSummaries.includes(key))
    : null;
  const skipLabel = ["raster:bands"];

  const sections = summaries.map(summary => {
    const sectionLabel = summary.label || "General";
    return (
      <React.Fragment key={`summary-${sectionLabel}`}>
        {Object.entries(summary.properties).map(([key, val]) => {
          const isHtml = typeof val.formatted === "string";
          const label = skipLabel.includes(key) ? "" : val.spec.label;

          return (
            <LabeledValue key={key} label={label}>
              {isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: val.formatted }} />
              ) : (
                val.formatted
              )}
            </LabeledValue>
          );
        })}
      </React.Fragment>
    );
  });

  return sections;
};

export default CollectionSummary;
