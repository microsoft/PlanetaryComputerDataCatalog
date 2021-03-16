import { Text } from "@fluentui/react";
import React from "react";
import { boldStyle } from "../../styles";
//import StacFields from "@radiantearth/stac-fields";

const TemporalExtent = ({ extent }) => {
  // Awaiting a new release which fixes bugs in these formatters
  //const formatted = StacFields.Formatters.formatExtent(extent.interval);
  //const formatted = StacFields.Formatters.formatTemporalExtent(extent.interval);
  const formatted = extent.interval.map((period, idx) => {
    const [start, end] = period;
    const startFormat = new Date(start).toLocaleDateString();
    const endFormat = end ? new Date(end).toLocaleDateString() : "Present";
    return (
      <Text key={`temporal-${idx}`}>{`${startFormat} - ${endFormat}`}</Text>
    );
  });

  return (
    <div>
      <Text styles={boldStyle}>Temporal extent:</Text> {formatted}
    </div>
  );
};

export default TemporalExtent;
