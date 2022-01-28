import { useCallback, useRef } from "react";
import {
  Coachmark,
  DirectionalHint,
  Link,
  TeachingBubbleContent,
} from "@fluentui/react";
import { useLocalStorage } from "react-use";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { buttonStyles } from "./ResetSelectors";
import {
  setCustomCqlExpressions,
  setIsCustomQuery,
} from "pages/Explore/state/mosaicSlice";
import { useCollectionMosaicInfo } from "pages/Explore/utils/hooks";

const AdvancedModeButton = () => {
  const dispatch = useExploreDispatch();
  const { isCustomQuery, collection } = useExploreSelector(s => s.mosaic);
  const { data: mosaicInfo, isSuccess } = useCollectionMosaicInfo(collection?.id);
  const [showAdvancedCoach, setShowAdvanceCoach] = useLocalStorage(
    "coach-show-advanced-mode",
    true
  );
  const linkRef = useRef<HTMLElement>(null);

  const handleClick = useCallback(() => {
    dispatch(setIsCustomQuery(true));

    setShowAdvanceCoach(false);
    if (isSuccess && mosaicInfo) {
      dispatch(setCustomCqlExpressions(mosaicInfo.defaultCustomQuery));
    }
  }, [dispatch, isSuccess, mosaicInfo, setShowAdvanceCoach]);

  const handleDismissCoach = useCallback(() => {
    setShowAdvanceCoach(false);
  }, [setShowAdvanceCoach]);

  const handleActivateCoach = useCallback(() => {
    handleClick();
  }, [handleClick]);

  const disabled = !collection || isCustomQuery;
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
      {showAdvancedCoach && !isCustomQuery && (
        <AdvancedCoachMark
          target={linkRef}
          handleDismiss={handleDismissCoach}
          handleActivate={handleActivateCoach}
        />
      )}
    </>
  );
};

export default AdvancedModeButton;

interface AdvancedCoachMarkProps {
  target: React.MutableRefObject<HTMLElement | null>;
  handleDismiss: () => void;
  handleActivate: () => void;
}

const AdvancedCoachMark = ({
  target,
  handleDismiss,
  handleActivate,
}: AdvancedCoachMarkProps) => {
  return (
    <Coachmark
      target={target.current}
      positioningContainerProps={{
        directionalHint: DirectionalHint.rightTopEdge,
      }}
      ariaAlertText="A coachmark has appeared for advanced mode"
      ariaDescribedByText="Press enter or alt + C to open the coachmark notification"
      ariaLabelledByText="Coachmark notification"
    >
      <TeachingBubbleContent
        headline="Advanced mode"
        hasCloseButton
        closeButtonAriaLabel="Close"
        primaryButtonProps={{ text: "Try it out!", onClick: handleActivate }}
        secondaryButtonProps={{ text: "Got it", onClick: handleDismiss }}
        onDismiss={handleDismiss}
      >
        Enable advanced mode to create a custom filter, including specific date
        ranges and attribute values.
      </TeachingBubbleContent>
    </Coachmark>
  );
};
