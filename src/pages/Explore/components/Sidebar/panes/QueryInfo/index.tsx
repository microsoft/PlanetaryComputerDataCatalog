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

import { useExploreSelector } from "pages/Explore/state/hooks";
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

  const renderSection = (
    <Section title="Rendering" icon="MapLayers">
      {renderOption?.description || renderOption?.name}
    </Section>
  );

  const title = "Current filter details";

  return (
    <>
      <IconButton
        id={buttonId}
        iconProps={{ iconName: "Info" }}
        ariaLabel={title}
        onClick={toggle}
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
