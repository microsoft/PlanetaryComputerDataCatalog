import { useCallback } from "react";
import { Link, Stack } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { buttonStyles } from "./ResetSelectors";
import { setIsCustomQuery } from "pages/Explore/state/mosaicSlice";

const CustomizeQuery = () => {
  const { isCustomQuery, collection } = useExploreSelector(s => s.mosaic);
  const dispatch = useExploreDispatch();

  const handleClick = useCallback(() => {
    dispatch(setIsCustomQuery(true));
  }, [dispatch]);

  const disabled = !collection || isCustomQuery;
  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link
        styles={buttonStyles}
        onClick={handleClick}
        disabled={disabled}
        data-cy="customize-query"
        title="Customize the current filters applied to this dataset"
      >
        Customize this filter
      </Link>
    </Stack>
  );
};

export default CustomizeQuery;
