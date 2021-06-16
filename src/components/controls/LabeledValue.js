import { Text } from "@fluentui/react";
import { boldStyle } from "../../styles";

const LabeledValue = ({ label, children }) => {
  return (
    <div className="collection-content-item">
      <Text block styles={boldStyle}>
        {label}:
      </Text>
      <Text block>{children}</Text>
    </div>
  );
};

export default LabeledValue;
