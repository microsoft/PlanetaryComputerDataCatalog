import { Text, useTheme } from "@fluentui/react";
import { IStacItem } from "types/stac";
import { stacFormatter } from "utils/stac";

interface MetadataListProps {
  item: IStacItem;
}

const MetadataList = ({ item }: MetadataListProps) => {
  const theme = useTheme();

  return (
    <>
      {item.properties &&
        Object.entries(item.properties).map(([key, val]) => {
          return (
            <div
              key={key}
              style={{
                padding: "4px 0",
                borderTop: "1px solid",
                borderTopColor: theme.palette.neutralLight,
              }}
            >
              <Text block styles={{ root: { fontWeight: 500 } }}>
                {stacFormatter.label(key)}
              </Text>
              <Text
                block
                styles={{ root: { marginLeft: 4, overflowWrap: "anywhere" } }}
              >
                {stacFormatter.format(val, key, item)}
              </Text>
            </div>
          );
        })}
    </>
  );
};

export default MetadataList;
