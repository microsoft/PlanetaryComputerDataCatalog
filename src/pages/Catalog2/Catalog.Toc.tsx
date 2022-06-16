import { useMemo } from "react";
import {
  FontWeights,
  Nav,
  INavLink,
  INavLinkGroup,
  INavStyles,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";

import { scrollToHash } from "utils";
import { useDataConfig } from "components/state/DataConfigProvider";
import { IStacCollection } from "types/stac";
import { useCollections } from "utils/requests";

const ungroupedName = "Other";

interface CatalogTocProps {
  setHashOnClick?: boolean;
  preFilterCollectionFn?: (collection: IStacCollection) => boolean;
  includeStorageDatasets?: boolean;
}

export const CatalogToc: React.FC<CatalogTocProps> = ({
  setHashOnClick = true,
  preFilterCollectionFn = () => true,
  includeStorageDatasets = true,
}) => {
  const { data: stacCollections } = useCollections();
  const { collectionConfig, storageCollectionConfig } = useDataConfig();
  const navigate = useNavigate();

  // Derive a list of categories from the collection config, and when the collections
  // have loaded, filter any categories out that don't have any collections in them given
  // the prefilter function.
  const filteredCollectionCategories = useMemo(() => {
    const categories = new Set<string>();
    if (!stacCollections) {
      Object.entries(collectionConfig).forEach(([_, dataset]) => {
        if (!dataset.isHidden) {
          categories.add(dataset.category || ungroupedName);
        }
      });
    } else {
      stacCollections.collections
        .filter(preFilterCollectionFn)
        .forEach(collection => {
          categories.add(collectionConfig[collection.id]?.category || ungroupedName);
        });
    }

    return Array.from(categories);
  }, [collectionConfig, preFilterCollectionFn, stacCollections]);

  // Extend the categories with the storage datasets if they are to be included.
  const categories = useMemo(() => {
    const categories = new Set<string>(filteredCollectionCategories);

    if (includeStorageDatasets) {
      Object.entries(storageCollectionConfig).forEach(([_, dataset]) => {
        categories.add(dataset.category || ungroupedName);
      });
    }
    const cats = Array.from(categories);

    cats.sort();

    // Add special category "Featured" to front of list
    cats.unshift("Featured");

    return cats;
  }, [
    filteredCollectionCategories,
    includeStorageDatasets,
    storageCollectionConfig,
  ]);

  // Generate the navigation elements from the categories
  const navLinkGroups = useMemo(() => generateNav(categories), [categories]);

  // Scroll page to the appropriate section on nav click
  const handleClick = (_: any, item?: INavLink | undefined) => {
    if (item && item.key) {
      setHashOnClick && navigate(`#${item.key}`, { replace: true });
      scrollToHash(item.key, "auto");
    }
  };

  return (
    <Nav
      className="catalog-toc sticky"
      data-cy="catalog-toc"
      styles={tocStyle}
      ariaLabel="Dataset category navigation"
      groups={navLinkGroups}
      onLinkClick={handleClick}
    />
  );
};

const generateNav = (categories: string[]): INavLinkGroup[] => {
  return [
    {
      links: categories.map(category => ({
        name: category,
        key: category,
        url: "",
      })),
    },
  ];
};

const tocStyle: Partial<INavStyles> = {
  link: {
    "&:after": { content: "" },
    padding: 2,
    backgroundColor: "rgba(0,0,0,0)",
    fontWeight: FontWeights.regular,
  },
  root: { marginRight: 35, maxHeight: "100vh" },
};
