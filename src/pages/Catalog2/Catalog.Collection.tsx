import {
  getTheme,
  ILinkStyles,
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
      _: React.MouseEvent<
        HTMLElement | HTMLAnchorElement | HTMLButtonElement,
        MouseEvent
      >
    ) => {
      onButtonClick && onButtonClick(collectionId);
    };
  };

  const href = getCollectionDetailUrl(collection.id);
  const title = collection.title || collection.id;
  const thumbnailBase = <CatalogCollectionThumbnail assets={collection.assets} />;
  const thumbnail = asButton ? (
    thumbnailBase
  ) : (
    <Link to={href}>{thumbnailBase}</Link>
  );

  const card = (
    <Stack
      horizontal
      styles={cardStyles}
      tokens={cardTokens}
      className="catalog-collection-item"
      data-cy="catalog-collection-item"
    >
      <StackItem shrink={0} className="catalog-collection-item--thumbnail">
        {thumbnail}
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
      <FluentLink styles={buttonStyles} onClick={handleButtonClick(collection.id)}>
        {card}
      </FluentLink>
    );
  }
  return card;
};

const theme = getTheme();
const cardStyles: IStackStyles = {
  root: {
    padding: 8,
    paddingLeft: 0,
    "button &": {
      paddingLeft: 8,
    },
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

const buttonStyles: ILinkStyles = {
  root: {
    width: "100%",
    color: theme.semanticColors.bodyText,
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: theme.palette.neutralLighterAlt,
      textDecoration: "none",
      color: theme.semanticColors.bodyText,
      border: `1px solid ${theme.palette.neutralLighter}`,
    },
    "&:focus": {
      color: theme.semanticColors.bodyText,
    },
    "&:active": {
      textDecoration: "none",
      color: theme.semanticColors.bodyText,
    },
    "&:active:hover": {
      textDecoration: "none",
      color: theme.semanticColors.bodyText,
    },
  },
};
