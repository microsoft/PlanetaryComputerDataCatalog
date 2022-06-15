import {
  IconButton,
  IIconProps,
  ITextStyles,
  MessageBar,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";
import { useDataConfig } from "components/state/DataConfigProvider";
import { noop } from "lodash-es";
import { CatalogCollection } from "pages/Catalog2/Catalog.Collection";
import { useCollections } from "utils/requests";
import {
  cancelIcon,
  contentStyles,
  iconButtonStyles,
} from "./CatalogSelector.index";

interface CatalogSelectorGroupProps {
  groupId: string;
  category?: string;
  onButtonClick: (collectionId: string) => void;
  onCloseClick: () => void;
  onBackClick: () => void;
}

export const CatalogSelectorGroup: React.FC<CatalogSelectorGroupProps> = ({
  groupId,
  category,
  onButtonClick,
  onCloseClick,
  onBackClick,
}) => {
  const { groupConfig, collectionConfig } = useDataConfig();
  const { data: stacCollections } = useCollections();

  const group = groupConfig[groupId];

  if (!group) {
    return (
      <MessageBar>
        <Text>Sorry, this group could not be found.</Text>
      </MessageBar>
    );
  }

  const groupCollections =
    stacCollections?.collections.filter(c => {
      const isGroup = c["msft:group_id"] === groupId;
      const isCategory = category
        ? collectionConfig[c.id].category === category
        : true;

      return isGroup && isCategory;
    }) || [];

  return (
    <>
      <Stack
        horizontal
        className={contentStyles.header}
        horizontalAlign={"space-between"}
        verticalAlign={"center"}
      >
        <StackItem>
          <IconButton
            styles={iconButtonStyles}
            iconProps={backIcon}
            ariaLabel="Return to collection list"
            title="Return to collection list"
            onClick={onBackClick}
          />
          <span className={`${contentStyles.title} ${contentStyles.titlePadded}`}>
            {group.title}
          </span>
        </StackItem>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close collection selector dialog"
          onClick={onCloseClick}
        />
      </Stack>
      <Stack styles={groupBodyStyles}>
        <Text styles={descStyles}>{group.short_description}</Text>
        {groupCollections.map(collection => (
          <CatalogCollection
            asButton
            key={collection.id}
            onButtonClick={onButtonClick}
            collection={collection}
            onKeywordClick={noop}
          />
        ))}
      </Stack>
    </>
  );
};

const backIcon: IIconProps = {
  iconName: "Back",
};

const descStyles: ITextStyles = { root: { padding: "10px 0px", maxWidth: 600 } };
const groupBodyStyles = { root: { padding: "10px 32px" } };
