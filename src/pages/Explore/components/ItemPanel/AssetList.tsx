import { FontWeights, PivotItem, Text, useTheme } from "@fluentui/react";
import { IStacItem } from "types/stac";

interface AssetListProps {
  item: IStacItem;
}

const AssetList = ({ item }: AssetListProps) => {
  const theme = useTheme();

  return (
    <PivotItem headerText="Assets">
      {item.assets &&
        Object.entries(item.assets).map(([key, asset]) => {
          return (
            <div
              key={key}
              style={{
                padding: "4px 0",
                borderTop: "1px solid",
                borderTopColor: theme.palette.neutralLight,
              }}
            >
              <Text block styles={{ root: { fontWeight: FontWeights.semibold } }}>
                {asset.title}
              </Text>
              <Text>{asset.description}</Text>
            </div>
          );
        })}
    </PivotItem>
  );
};

export default AssetList;
