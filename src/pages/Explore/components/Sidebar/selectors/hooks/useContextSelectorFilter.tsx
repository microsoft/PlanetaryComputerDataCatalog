import {
  getTheme,
  IContextualMenuListProps,
  IRenderFunction,
  ISearchBoxStyles,
  SearchBox,
} from "@fluentui/react";
import { useCallback, useEffect, useState } from "react";
import { IStacCollection } from "types/stac";

export const useCollectionFilter = (collections: IStacCollection[] | undefined) => {
  const [filteredCollections, setFilteredCollections] = useState(() => collections);

  useEffect(() => {
    setFilteredCollections(collections);
  }, [collections]);

  const handleFilterAbort = useCallback(() => {
    setFilteredCollections(collections);
  }, [collections]);

  const onChange = useCallback(
    (_: any, newValue: string | undefined) => {
      if (newValue === undefined || newValue.trim() === "") {
        setFilteredCollections(collections);
        return;
      }

      const filtered = (collections || []).filter(collection =>
        matchesTerm(collection, newValue)
      );

      setFilteredCollections(filtered);
    },
    [collections]
  );

  const renderMenuList: IRenderFunction<IContextualMenuListProps> = useCallback(
    (
      props: IContextualMenuListProps | undefined,
      defaultRender:
        | IRenderFunction<IContextualMenuListProps | undefined>
        | undefined
    ) => {
      if (!defaultRender) return null;
      return (
        <div>
          <div style={{ borderBottom: "1px solid #ccc" }}>
            <SearchBox
              ariaLabel="Filter datasets by text"
              placeholder="Filter datasets"
              onClear={handleFilterAbort}
              onAbort={handleFilterAbort}
              onChange={onChange}
              autoFocus={false}
              styles={searchBoxStyles}
            />
          </div>
          {defaultRender(props)}
        </div>
      );
    },
    [handleFilterAbort, onChange]
  );

  return { filteredCollections, renderMenuList, handleFilterAbort };
};

const matchesTerm = (collection: IStacCollection, searchText: string) => {
  return (
    !searchText ||
    (collection.title &&
      collection.title.toLowerCase().includes(searchText.toLowerCase()))
  );
};

const theme = getTheme();
const searchBoxStyles: ISearchBoxStyles = {
  root: {
    margin: "5px 15px 5px 8px",
    borderColor: theme.palette.neutralTertiaryAlt,
  },
};
