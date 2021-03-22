import { Text } from "@fluentui/react";
import React from "react";
import LabeledValue from "../controls/LabeledValue";

const TemporalExtent = ({ extent }) => {
  const formatted = extent.interval.map((period, idx) => {
    const [start, end] = period;
    const startFormat = new Date(start).toLocaleDateString();
    const endFormat = end ? new Date(end).toLocaleDateString() : "Present";
    return (
      <Text key={`temporal-${idx}`}>{`${startFormat} - ${endFormat}`}</Text>
    );
  });

  return <LabeledValue label="Temporal extent">{formatted}</LabeledValue>;
};

export default TemporalExtent;
