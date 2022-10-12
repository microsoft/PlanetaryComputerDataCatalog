import { Text } from "@fluentui/react";
import { formatDateShort } from "pages/Explore/utils/time";
import { IStacCollection } from "types/stac";
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

    const startFormat = formatDateShort(start as string);
    const endFormat = end ? formatDateShort(end) : "Present";
    return (
      <Text block key={`temporal-${idx}`}>{`${startFormat} – ${endFormat}`}</Text>
    );
  });

  return <LabeledValue label={label}>{formatted}</LabeledValue>;
};

export default TemporalExtent;
