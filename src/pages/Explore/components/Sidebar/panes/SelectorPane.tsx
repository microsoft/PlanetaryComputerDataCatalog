import { IStackTokens, Stack } from "@fluentui/react";
import { ErrorBoundary } from "react-error-boundary";

import CustomizeQuery from "../CustomizeQuery";
import CustomQueryBuilder from "../CustomQueryBuilder";
import ErrorFallback from "components/ErrorFallback";
import ResetSelectors from "../ResetSelectors";
import {
  CollectionSelector,
  MosaicPresetSelector,
  RenderOptionsSelector,
} from "../selectors";

interface SelectorPaneProps {
  isCustomQuery: boolean;
}

const SelectorPane = ({ isCustomQuery }: SelectorPaneProps) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Stack tokens={stackTokens}>
        <CollectionSelector />
        {!isCustomQuery && <MosaicPresetSelector />}
        {isCustomQuery && <CustomQueryBuilder />}
        <RenderOptionsSelector />
        <Stack horizontal horizontalAlign="end" tokens={stackTokens}>
          <CustomizeQuery />
          <ResetSelectors />
        </Stack>
      </Stack>
    </ErrorBoundary>
  );
};

export default SelectorPane;

const stackTokens: IStackTokens = {
  childrenGap: 5,
};
