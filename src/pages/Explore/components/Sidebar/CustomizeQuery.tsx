import { useCallback } from "react";
import { Link, Stack } from "@fluentui/react";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { buttonStyles } from "./ResetSelectors";
import { setIsCustomQuery } from "pages/Explore/state/mosaicSlice";

const CustomizeQuery = () => {
  const dispatch = useExploreDispatch();

  const handleClick = useCallback(() => {
    dispatch(setIsCustomQuery(true));
  }, [dispatch]);

  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link styles={buttonStyles} onClick={handleClick} data-cy="customize-query">
        Customize this filter
      </Link>
    </Stack>
  );
};

export default CustomizeQuery;
