import { useCallback } from "react";
import { Link, Stack } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { buttonStyles } from "./ResetSelectors";
import { setIsCustomQuery } from "pages/Explore/state/mosaicSlice";

const CustomizeQuery = () => {
  const isCustomized = useExploreSelector(s => s.mosaic.isCustomQuery);
  const dispatch = useExploreDispatch();

  const handleClick = useCallback(() => {
    dispatch(setIsCustomQuery(true));
  }, [dispatch]);

  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link
        styles={buttonStyles}
        onClick={handleClick}
        disabled={isCustomized}
        data-cy="customize-query"
      >
        Customize this filter
      </Link>
    </Stack>
  );
};

export default CustomizeQuery;
