import React from "react";

import LabeledValue from "./LabeledValue";

const SimpleKeyValueList = ({ object }) => {
  return (
    <div className="json-list">
      {Object.entries(object).map(([key, val]) => (
        <LabeledValue key={key} label={key}>
          {val}
        </LabeledValue>
      ))}
    </div>
  );
};

export default SimpleKeyValueList;
