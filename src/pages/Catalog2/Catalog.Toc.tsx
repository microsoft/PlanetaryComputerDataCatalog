import { useMemo } from "react";
import { Nav, INavLink, INavLinkGroup, INavStyles } from "@fluentui/react/lib/Nav";
import { useNavigate } from "react-router-dom";

import { collections as collectionConfig } from "config/datasets.yml";
import { scrollToHash } from "utils";

const ungroupedName = "Other";

export const CatalogToc: React.FC = () => {
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
  }, []);

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
      className="sticky"
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
  link: { padding: 2 },
  root: { marginRight: 35 },
};
