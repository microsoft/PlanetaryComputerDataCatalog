import {
  Callout,
  IconButton,
  Text,
  mergeStyleSets,
  Separator,
  DirectionalHint,
  Icon,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";

import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import QuerySection from "./QuerySection";
import Section from "./Section";
import NewTabLink from "components/controls/NewTabLink";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback, { handleErrorBoundaryError } from "components/ErrorFallback";
import {
  selectCurrentCql,
  selectCurrentMosaic,
} from "pages/Explore/state/mosaicSlice";
import { searchHeaderButtonStyle } from "../../PinLayer/PinLayer";
import { setShowAnimationPanel } from "pages/Explore/state/mapSlice";

const QueryInfo = () => {
  const { collection, renderOption } = useExploreSelector(selectCurrentMosaic);
  const cql = useExploreSelector(selectCurrentCql);
  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("queryinfo-button");
  const labelId = useId("queryinfo-label");

  const collectionSection = collection ? (
    <Section title={collection?.title} icon={"World"}>
      <Text>
        {collection?.["msft:short_description"]}{" "}
        <NewTabLink
          href={`//${window.location.host}/dataset/${collection?.id}`}
          title="See full dataset description"
        >
          <Icon iconName="NavigateExternalInline" />
        </NewTabLink>
      </Text>
    </Section>
  ) : null;

  const querySection = <QuerySection cql={cql} />;

  const renderDesc = renderOption?.description ? (
    <span
      dangerouslySetInnerHTML={{
        __html: marked.parseInline(DOMPurify.sanitize(renderOption.description)),
      }}
    />
  ) : (
    renderOption?.name
  );
  const renderSection = (
    <Section title="Rendering" icon="MapLayers">
      {renderDesc}
    </Section>
  );

  const title = "Current filter details";

  // Temp
  const dispatch = useExploreDispatch();
  return (
    <>
      <IconButton
        id={buttonId}
        iconProps={{ iconName: "Info" }}
        ariaLabel={title}
        onClick={() => {
          toggle();
          dispatch(setShowAnimationPanel(true));
        }}
        data-cy="query-detail-button"
        styles={searchHeaderButtonStyle}
      />
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          role="alertdialog"
          gapSpace={0}
          target={`#${buttonId}`}
          onDismiss={toggle}
          directionalHint={DirectionalHint.rightCenter}
          setInitialFocus
        >
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={handleErrorBoundaryError}
          >
            {collectionSection}
            <Separator />
            {querySection}
            <Separator />
            {renderSection}
          </ErrorBoundary>
        </Callout>
      )}
    </>
  );
};
export default QueryInfo;

const styles = mergeStyleSets({
  callout: {
    width: 420,
    padding: "20px 24px",
  },
});
