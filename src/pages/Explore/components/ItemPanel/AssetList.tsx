import { PivotItem, Text } from "@fluentui/react";
import { IStacItem } from "types/stac";
import { mediaTypeOverride } from "utils/stac";
import DetailListItem from "./DetailListItem";

interface AssetListProps {
  item: IStacItem;
}

const AssetList = ({ item }: AssetListProps) => {
  return (
    <PivotItem headerText="Assets">
      {item.assets &&
        Object.entries(item.assets).map(([key, asset]) => {
          return (
            <DetailListItem
              key={key}
              label={asset.title}
              value={
                <>
                  <Text block>
                    <code>{`${asset?.roles?.[0]}: ${mediaTypeOverride(
                      asset.type
                    )}`}</code>
                  </Text>
                  <Text>{asset.description}</Text>
                </>
              }
            />
          );
        })}
    </PivotItem>
  );
};

export default AssetList;
