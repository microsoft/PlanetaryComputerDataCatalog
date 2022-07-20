import { Text } from "@fluentui/react";
import { IStacCollection } from "types/stac";
import { toUtcDateString } from "utils";
import LabeledValue from "../controls/LabeledValue";

interface TemporalExtentProps {
  extent: IStacCollection["extent"]["temporal"];
  label?: string;
}

const TemporalExtent: React.FC<TemporalExtentProps> = ({
  extent,
  label = "Temporal Extent",
}) => {
  const formatted = extent.interval.map((period, idx) => {
    const [start, end] = period;

    const startFormat = toUtcDateString(start as string);
    const endFormat = end ? toUtcDateString(end) : "Present";
    return (
      <Text block key={`temporal-${idx}`}>{`${startFormat} – ${endFormat}`}</Text>
    );
  });

  return <LabeledValue label={label}>{formatted}</LabeledValue>;
};

export default TemporalExtent;
