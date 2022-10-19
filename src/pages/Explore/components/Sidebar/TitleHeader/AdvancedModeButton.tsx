import { useCallback, useRef } from "react";
import { Link } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { buttonStyles } from "./ResetSelectors";
import {
  selectCurrentMosaic,
  setCustomCqlExpressions,
  setIsCustomQuery,
} from "pages/Explore/state/mosaicSlice";
import { useCollectionMosaicInfo } from "pages/Explore/utils/hooks";

const AdvancedModeButton = () => {
  const dispatch = useExploreDispatch();
  const { isCustomQuery, collection } = useExploreSelector(selectCurrentMosaic);
  const { previewMode } = useExploreSelector(s => s.detail);
  const { data: mosaicInfo, isSuccess } = useCollectionMosaicInfo(collection?.id);
  const linkRef = useRef<HTMLElement>(null);

  const handleClick = useCallback(() => {
    dispatch(setIsCustomQuery(true));

    if (isSuccess && mosaicInfo) {
      dispatch(setCustomCqlExpressions(mosaicInfo.defaultCustomQuery));
    }
  }, [dispatch, isSuccess, mosaicInfo]);

  const disabled = !collection || isCustomQuery || previewMode.enabled;
  return (
    <>
      <Link
        ref={linkRef}
        styles={buttonStyles}
        onClick={handleClick}
        disabled={disabled}
        data-cy="customize-query"
        title="Customize the current filters applied to this dataset"
      >
        Advanced
      </Link>
    </>
  );
};

export default AdvancedModeButton;
