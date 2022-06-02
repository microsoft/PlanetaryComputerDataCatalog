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

const ungroupedName = "Other";

interface CatalogTocProps {
  collectionConfig: Record<string, DatasetEntry>;
}

export const CatalogToc: React.FC<CatalogTocProps> = ({ collectionConfig }) => {
  const navigate = useNavigate();

  // Generate categories from the local dataset configuration
  const categories = useMemo(() => {
    const categories = new Set<string>();
    Object.entries(collectionConfig).forEach(([_, dataset]) => {
      categories.add(dataset.category || ungroupedName);
    });
    const cats = Array.from(categories);
    cats.sort();

    // Add special category "Featured" to front of list
    cats.unshift("Featured");

    return cats;
  }, [collectionConfig]);

  // Generate the navigation elements from the categories
  const navLinkGroups = useMemo(() => generateNav(categories), [categories]);

  // Scroll page to the appropriate section on nav click
  const handleClick = (_: any, item?: INavLink | undefined) => {
    if (item && item.key) {
      navigate(`#${item.key}`, { replace: true });
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
