import LabeledValue from "./LabeledValue";

const SimpleKeyValueList = ({ object }) => {
  return (
    <div className="json-list">
      {Object.entries(object).map(([key, val]) => {
        if (Array.isArray(val) || typeof val === "object") return null;

        return (
          <LabeledValue key={key} label={key}>
            {val}
          </LabeledValue>
        );
      })}
    </div>
  );
};

export default SimpleKeyValueList;
