import React from "react";
import StacFields from "@radiantearth/stac-fields";
import { Text } from "@fluentui/react";
import { boldStyle } from "../../styles";

const CollectionSummary = ({ collection }) => {
  const summaries = collection ? StacFields.formatSummaries(collection) : null;

  const sections = summaries.map(summary => {
    const sectionLabel = summary.label || "General";
    return (
      <React.Fragment key={`summary-${sectionLabel}`}>
        <h3>{sectionLabel}</h3>
        {Object.entries(summary.properties).map(([key, val]) => {
          return (
            <div key={key} style={{ paddingBottom: 10 }}>
              <Text variant='mediumPlus' styles={boldStyle}>
                {val.spec.label}:
              </Text>
              <div dangerouslySetInnerHTML={{ __html: val.formatted }} />
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  return (
    <section>
      <h2>Summary</h2>
      {sections}
    </section>
  );
};

export default CollectionSummary;
