import { useCallback } from "react";
import { FontSizes, Link, Stack } from "@fluentui/react";

import { useExploreDispatch, useExploreSelector } from "../../state/hooks";
import { resetMosaicState } from "pages/Explore/state/mosaicSlice";

const ResetSelectors = () => {
  const dispatch = useExploreDispatch();
  const { collection } = useExploreSelector(state => state.mosaic);
  const disabled = !collection;

  const handleClick = useCallback(() => {
    dispatch<any>(resetMosaicState());
  }, [dispatch]);

  return (
    <Stack horizontal horizontalAlign={"end"}>
      <Link
        disabled={disabled}
        styles={buttonStyles}
        onClick={handleClick}
        data-cy="reset"
      >
        Reset
      </Link>
    </Stack>
  );
};

export default ResetSelectors;

const buttonStyles = {
  root: {
    marginRight: "2px",
    fontSize: FontSizes.small,
  },
};
