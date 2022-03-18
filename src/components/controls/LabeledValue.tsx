import { Text } from "@fluentui/react";

interface LabeledValueProps {
  label: string;
  indent?: boolean;
}

const LabeledValue: React.FC<LabeledValueProps> = ({
  label,
  indent = false,
  children = null,
}) => {
  if (label === null) return null;
  return (
    <div className="collection-content-item">
      <Text block as="h3" styles={{ root: { fontWeight: 600, margin: "0 0 4px" } }}>
        {label}
      </Text>
      <Text
        block
        style={{ maxHeight: 150, overflowY: "auto", marginLeft: indent ? 2 : 0 }}
        tabIndex={0}
      >
        {children}
      </Text>
    </div>
  );
};

export default LabeledValue;
