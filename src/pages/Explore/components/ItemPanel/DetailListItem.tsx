import { FontWeights, Text, useTheme } from "@fluentui/react";

interface DetailListItemProps {
  label: string | undefined | React.ReactNode;
  value: string | undefined | React.ReactNode;
}

const DetailListItem = ({ label, value }: DetailListItemProps) => {
  const theme = useTheme();
  return (
    <div
      style={{
        padding: "6px 0",
        borderTop: "1px solid",
        borderTopColor: theme.palette.neutralLight,
      }}
    >
      <Text block styles={{ root: { fontWeight: FontWeights.semibold } }}>
        {label}
      </Text>
      <Text block styles={{ root: { marginLeft: 4, overflowWrap: "anywhere" } }}>
        {value}
      </Text>
    </div>
  );
};

export default DetailListItem;
