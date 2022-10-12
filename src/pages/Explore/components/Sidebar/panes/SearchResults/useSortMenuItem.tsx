import { IContextualMenuItem } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";

import {
  selectCurrentMosaic,
  setMosaicQuery,
} from "pages/Explore/state/mosaicSlice";
import { IMosaic, ISortDir } from "pages/Explore/types";

export const useSortMenuItem = (): IContextualMenuItem => {
  const dispatch = useExploreDispatch();
  const { query } = useExploreSelector(selectCurrentMosaic);

  const clickHandler = (dir: ISortDir) => {
    return (
      e:
        | React.MouseEvent<HTMLElement, MouseEvent>
        | React.KeyboardEvent<HTMLElement>
        | undefined
    ) => {
      const updatedMosaic: IMosaic = {
        ...query,
        sortby: dir,
      };
      dispatch(setMosaicQuery(updatedMosaic));
      e?.preventDefault();
    };
  };

  return {
    key: "sortby",
    text: "Sort order",
    iconProps: { iconName: "Sort" },
    subMenuProps: {
      items: [
        {
          key: "sortby-date",
          text: "Date descending",
          title: "Show newest results first",
          iconProps: { iconName: "SortDown" },
          canCheck: true,
          checked: !query.sortby || query.sortby === "desc",
          onClick: clickHandler("desc"),
        },
        {
          key: "sortby-date-asc",
          text: "Date ascending",
          title: "Show oldest results first",
          iconProps: { iconName: "SortUp" },
          canCheck: true,
          checked: query.sortby === "asc",
          onClick: clickHandler("asc"),
        },
      ],
    },
  };
};
