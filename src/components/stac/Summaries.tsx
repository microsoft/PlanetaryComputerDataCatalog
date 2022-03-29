import React from "react";
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
      spec: { label: string };
      value: any;
    }
  >;
};

const CollectionSummary = ({ collection }: Props) => {
  const summaries = collection
    ? stacFormatter.formatSummaries(collection, (key: string) => key !== "eo:bands")
    : [];
  const skipLabel = ["raster:bands"];

  const sections = (summaries as Summary[]).map(summary => {
    const sectionLabel = summary.label || "General";
    const items = Object.entries(summary.properties).map(([key, val]) => {
      const label = skipLabel.includes(key) ? "" : val.spec.label;
      let isHtml = typeof val.formatted === "string";
      let formatted = val.formatted;

      // Handle arrays directly, formatting each value, and joining to a string
      if (Array.isArray(val.value)) {
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
            <div dangerouslySetInnerHTML={{ __html: val.formatted }} />
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
