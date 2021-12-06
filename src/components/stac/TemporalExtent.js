import { Text } from "@fluentui/react";
import React from "react";
import { toUtcDateString } from "utils";
import LabeledValue from "../controls/LabeledValue";

const TemporalExtent = ({ extent }) => {
  const formatted = extent.interval.map((period, idx) => {
    const [start, end] = period;
    console.log(period);
    const startFormat = toUtcDateString(start);
    const endFormat = end ? toUtcDateString(end) : "Present";
    return (
      <Text block key={`temporal-${idx}`}>{`${startFormat} - ${endFormat}`}</Text>
    );
  });

  return <LabeledValue label="Temporal extent">{formatted}</LabeledValue>;
};

export default TemporalExtent;
