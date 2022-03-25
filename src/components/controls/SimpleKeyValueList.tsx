import LabeledValue from "./LabeledValue";
import { stacFormatter } from "utils/stac";

interface Props {
  object: Record<string, any>;
  indent?: boolean;
}
const SimpleKeyValueList = ({ object, indent = false }: Props) => {
  return (
    <div className="json-list">
      {Object.entries(object).map(([key, val]) => {
        if (Array.isArray(val) || typeof val === "object") return null;

        return (
          <LabeledValue key={key} label={stacFormatter.label(key)} indent={indent}>
            {val}
          </LabeledValue>
        );
      })}
    </div>
  );
};

export default SimpleKeyValueList;
