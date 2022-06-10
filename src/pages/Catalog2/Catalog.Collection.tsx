import {
  IStackStyles,
  IStackTokens,
  ITextStyles,
  Link as FluentLink,
  Stack,
  StackItem,
  Text,
} from "@fluentui/react";
import Keywords from "components/stac/Keywords";
import { Link } from "react-router-dom";

import { IPcCollection } from "types/stac";
import { CatalogCollectionThumbnail } from "./Catalog.Thumbnail";
import { getCollectionDetailUrl } from "./helpers";

interface CatalogCollectionProps {
  collection: IPcCollection;
  onKeywordClick: (keyword: string) => void;
  // If true, the collection is displayed as a single button element
  asButton: boolean;
  onButtonClick?: (collectionId: string) => void;
}

export const CatalogCollection: React.FC<CatalogCollectionProps> = ({
  collection,
  onKeywordClick,
  asButton,
  onButtonClick,
}) => {
  const handleButtonClick = (collectionId: string) => {
    return (
      e: React.MouseEvent<
        HTMLElement | HTMLAnchorElement | HTMLButtonElement,
        MouseEvent
      >
    ) => {
      onButtonClick && onButtonClick(collectionId);
    };
  };

  const href = getCollectionDetailUrl(collection.id);
  const title = collection.title || collection.id;
  const card = (
    <Stack
      horizontal
      styles={cardStyles}
      tokens={cardTokens}
      className="catalog-collection-item"
      data-cy="catalog-collection-item"
    >
      <StackItem shrink={0} className="catalog-collection-item--thumbnail">
        <Link to={href}>
          <CatalogCollectionThumbnail assets={collection.assets} />
        </Link>
      </StackItem>
      <StackItem styles={contentStyles} className="catalog-collection-item--content">
        <h3 style={titleStyle}>
          {asButton ? title : <Link to={href}>{title}</Link>}{" "}
        </h3>
        <Text block styles={descStyles}>
          {collection["msft:short_description"]}
        </Text>
        {!asButton && (
          <div style={keywordContainerStyle}>
            <Keywords
              keywords={collection.keywords}
              color="#4C4C51"
              onClick={onKeywordClick}
            />
          </div>
        )}
      </StackItem>
    </Stack>
  );
  if (asButton) {
    return (
      <FluentLink onClick={handleButtonClick(collection.id)}>{card}</FluentLink>
    );
  }
  return card;
};

const cardStyles: IStackStyles = {
  root: {
    paddingBottom: 10,
  },
};

const cardTokens: IStackTokens = {
  childrenGap: 10,
};

const contentStyles: IStackStyles = {
  root: {
    maxWidth: 600,
  },
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 10,
};

const descStyles: ITextStyles = {};

const keywordContainerStyle: React.CSSProperties = {
  marginTop: 10,
};
