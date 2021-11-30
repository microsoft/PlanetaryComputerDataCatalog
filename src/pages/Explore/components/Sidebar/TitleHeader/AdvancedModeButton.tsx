import { useCallback } from "react";
import { Link } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { buttonStyles } from "./ResetSelectors";
import {
  setCustomCqlExpressions,
  setIsCustomQuery,
} from "pages/Explore/state/mosaicSlice";
import { useCollectionMosaicInfo } from "pages/Explore/utils/hooks";

const AdvancedModeButton = () => {
  const { isCustomQuery, collection } = useExploreSelector(s => s.mosaic);
  const dispatch = useExploreDispatch();
  const { data: mosaicInfo, isSuccess } = useCollectionMosaicInfo(collection?.id);

  const handleClick = useCallback(() => {
    dispatch(setIsCustomQuery(true));

    if (isSuccess && mosaicInfo) {
      dispatch<any>(setCustomCqlExpressions(mosaicInfo.defaultCustomQuery));
    }
  }, [dispatch, isSuccess, mosaicInfo]);

  const disabled = !collection || isCustomQuery;
  return (
    <Link
      styles={buttonStyles}
      onClick={handleClick}
      disabled={disabled}
      data-cy="customize-query"
      title="Customize the current filters applied to this dataset"
    >
      Advanced
    </Link>
  );
};

export default AdvancedModeButton;
