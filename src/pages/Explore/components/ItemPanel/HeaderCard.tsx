import { FontWeights, Text, useTheme } from "@fluentui/react";
import { IStacItem } from "types/stac";

interface HeaderCardProps {
  collectionName: string | undefined;
  item: IStacItem;
}

const HeaderCard = ({ collectionName, item }: HeaderCardProps) => {
  const theme = useTheme();
  return (
    <div
      style={{
        padding: 15,
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderTopColor: theme.palette.neutralLight,
        borderBottomColor: theme.palette.neutralLight,
      }}
    >
      <Text
        variant={"medium"}
        styles={{ root: { fontWeight: FontWeights.semibold } }}
        block
      >
        {collectionName}
      </Text>
      <Text
        variant={"large"}
        styles={{ root: { fontWeight: FontWeights.bold, overflowWrap: "anywhere" } }}
        block
      >
        {item.id}
      </Text>
    </div>
  );
};

export default HeaderCard;
