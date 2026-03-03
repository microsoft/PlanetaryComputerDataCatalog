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
        if (val == null) return null;

        if (Array.isArray(val)) {
          return (
            <LabeledValue key={key} label={stacFormatter.label(key)} indent={indent}>
              {val.join(", ")}
            </LabeledValue>
          );
        }

        if (typeof val === "object") {
          return (
            <LabeledValue key={key} label={stacFormatter.label(key)} indent={indent}>
              <SimpleKeyValueList object={val} indent />
            </LabeledValue>
          );
        }

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
