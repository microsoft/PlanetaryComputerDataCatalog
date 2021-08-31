import { FontWeights, Text, useTheme } from "@fluentui/react";
import { IStacItem } from "types/stac";
import PriorityAttributes from "../controls/PriorityAttributes";
import MapButton from "./MapButton";

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
      <MapButton />
      <Text
        block
        variant={"medium"}
        styles={{ root: { fontWeight: FontWeights.semibold } }}
      >
        {collectionName}
      </Text>
      <Text
        block
        variant={"large"}
        styles={{ root: { fontWeight: FontWeights.bold, overflowWrap: "anywhere" } }}
      >
        {item.id}
      </Text>
      <div style={{ paddingTop: 3 }}>
        <PriorityAttributes item={item} />
      </div>
    </div>
  );
};

export default HeaderCard;
