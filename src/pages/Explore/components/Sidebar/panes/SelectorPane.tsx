import { IStackTokens, Stack } from "@fluentui/react";
import { ErrorBoundary } from "react-error-boundary";

import CustomQueryBuilder from "../selectors/CustomQueryBuilder";
import ErrorFallback from "components/ErrorFallback";
import { MosaicPresetSelector, RenderOptionsSelector } from "../selectors";
import CollectionSelectorV2 from "../selectors/CollectionSelectorV2";

interface SelectorPaneProps {
  isCustomQuery: boolean;
}

const SelectorPane = ({ isCustomQuery }: SelectorPaneProps) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Stack tokens={stackTokens}>
        <CollectionSelectorV2 />
        {!isCustomQuery && <MosaicPresetSelector />}
        {isCustomQuery && <CustomQueryBuilder />}
        <RenderOptionsSelector />
      </Stack>
    </ErrorBoundary>
  );
};

export default SelectorPane;

const stackTokens: IStackTokens = {
  childrenGap: 6,
};
