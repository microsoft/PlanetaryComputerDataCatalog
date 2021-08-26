import { FontWeights, Separator, Text } from "@fluentui/react";
import { IStacItem } from "types/stac";

interface HeaderCardProps {
  collectionName: string | undefined;
  item: IStacItem;
}

const HeaderCard = ({ collectionName, item }: HeaderCardProps) => {
  return (
    <>
      <Text
        variant={"large"}
        styles={{ root: { fontWeight: FontWeights.bold, overflowWrap: "anywhere" } }}
        block
      >
        {item.id}
      </Text>
      <Text
        variant={"mediumPlus"}
        styles={{ root: { fontWeight: FontWeights.semibold } }}
        block
      >
        {collectionName}
      </Text>
      <Separator />
    </>
  );
};

export default HeaderCard;
