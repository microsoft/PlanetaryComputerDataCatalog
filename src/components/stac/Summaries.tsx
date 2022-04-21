import React from "react";
import DOMPurify from "dompurify";

import { IStacCollection } from "types/stac";
import { stacFormatter } from "utils/stac";
import LabeledValue from "../controls/LabeledValue";

interface Props {
  collection: IStacCollection;
}

type Summary = {
  extension: string;
  label: string;
  properties: Record<
    string,
    {
      formatted: any;
      label: string | null;
      spec: { label: string };
      value: any;
    }
  >;
};

const CollectionSummary = ({ collection }: Props) => {
  // Some summaries are taken care of by other sections and should be excluded
  // in the side panel
  const skipSummaries = ["eo:bands", "sci:doi"];
  const summaries = collection
    ? stacFormatter.formatSummaries(
        collection,
        (key: string) => !skipSummaries.includes(key)
      )
    : [];

  // Some summaries produce extraneous labels, and can be ignored
  const skipLabel = ["raster:bands"];

  const sections = (summaries as Summary[]).map(summary => {
    const sectionLabel = summary.label || "General";
    const items = Object.entries(summary.properties).map(([key, val]) => {
      const label = skipLabel.includes(key) ? "" : val.label || val.spec.label;
      let isHtml = typeof val.formatted === "string";
      const isComponent = React.isValidElement(val.formatted?.[0]);
      let formatted = val.formatted;

      // Handle arrays directly, formatting each value, and joining to a string
      if (!isComponent && Array.isArray(val.value)) {
        formatted = val.value
          .slice()
          .sort((a, b) => a - b)
          .map(v => stacFormatter.format(v, key))
          .join(", ");

        // Override original formatting
        isHtml = false;
      }

      return (
        <LabeledValue key={key} label={label}>
          {isHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(val.formatted) }}
            />
          ) : (
            formatted
          )}
        </LabeledValue>
      );
    });

    return <React.Fragment key={`summary-${sectionLabel}`}>{items}</React.Fragment>;
  });

  return sections;
};

export default CollectionSummary;
