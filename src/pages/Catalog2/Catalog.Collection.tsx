import {
  IStackStyles,
  IStackTokens,
  ITextStyles,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";
import Keywords from "components/stac/Keywords";
import { Link } from "react-router-dom";

import { IStacCollection } from "types/stac";
import { GROUP_PREFIX } from "./Catalog.CollectionList";
import { CatalogCollectionThumbnail } from "./Catalog.Thumbnail";

interface CatalogCollectionProps {
  collection: IStacCollection;
}

export const CatalogCollection: React.FC<CatalogCollectionProps> = ({
  collection,
}) => {
  const href = collection.id.startsWith(GROUP_PREFIX)
    ? `/dataset/group/${collection.id.substring(GROUP_PREFIX.length)}`
    : `/dataset/${collection.id}`;

  return (
    <Stack horizontal styles={cardStyles} tokens={cardTokens}>
      <StackItem shrink={0}>
        <Link to={href}>
          <CatalogCollectionThumbnail assets={collection.assets} />
        </Link>
      </StackItem>
      <StackItem>
        <h3 style={titleStyle}>
          <Link to={href}>{collection.title || collection.id}</Link>{" "}
        </h3>
        <Text block styles={descStyles}>
          {collection["msft:short_description"]}
        </Text>
        <div style={keywordContainerStyle}>
          <Keywords keywords={collection.keywords} color="#4C4C51" />
        </div>
      </StackItem>
    </Stack>
  );
};

const cardStyles: IStackStyles = {
  root: {
    paddingBottom: 10,
  },
};

const cardTokens: IStackTokens = {
  childrenGap: 10,
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 10,
};

const descStyles: ITextStyles = {
  root: { maxWidth: 600 },
};

const keywordContainerStyle: React.CSSProperties = {
  marginTop: 10,
};
