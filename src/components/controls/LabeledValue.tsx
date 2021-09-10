import { Text } from "@fluentui/react";

interface LabeledValueProps {
  label: string;
}

const LabeledValue: React.FC<LabeledValueProps> = ({ label, children = null }) => {
  if (!label) return null;
  return (
    <div className="collection-content-item">
      <Text block styles={{ root: { fontWeight: 500 } }}>
        {label}:
      </Text>
      <Text block style={{ maxHeight: 150, overflowY: "auto" }} tabIndex={0}>
        {children}
      </Text>
    </div>
  );
};

export default LabeledValue;
