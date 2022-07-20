import {
  Callout,
  Text,
  mergeStyleSets,
  Separator,
  DirectionalHint,
  Icon,
} from "@fluentui/react";
import { marked } from "marked";
import DOMPurify from "dompurify";

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

interface QueryInfoProps {
  onDismiss: () => void;
  targetElementId: string;
}

const QueryInfo: React.FC<QueryInfoProps> = ({ onDismiss, targetElementId }) => {
  const { collection, renderOption } = useExploreSelector(selectCurrentMosaic);
  const cql = useExploreSelector(selectCurrentCql);

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

  return (
    <>
      <Callout
        className={styles.callout}
        role="alertdialog"
        gapSpace={0}
        target={`#${targetElementId}`}
        onDismiss={onDismiss}
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
