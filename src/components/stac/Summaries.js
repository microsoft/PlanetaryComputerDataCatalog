import React from "react";
import StacFields from "@radiantearth/stac-fields";
import LabeledValue from "../controls/LabeledValue";

const CollectionSummary = ({ collection }) => {
  const summaries = collection
    ? StacFields.formatSummaries(collection, key => key !== "eo:bands")
    : null;

  const sections = summaries.map(summary => {
    const sectionLabel = summary.label || "General";
    return (
      <React.Fragment key={`summary-${sectionLabel}`}>
        {Object.entries(summary.properties).map(([key, val]) => {
          return (
            <LabeledValue key={key} label={val.spec.label}>
              <div dangerouslySetInnerHTML={{ __html: val.formatted }} />
            </LabeledValue>
          );
        })}
      </React.Fragment>
    );
  });

  return sections;
};

export default CollectionSummary;
