import {
  Callout,
  DirectionalHint,
  FontWeights,
  FontSizes,
  PrimaryButton,
  Stack,
  mergeStyleSets,
  getTheme,
  Text,
  DefaultButton,
  StackItem,
  useTheme,
} from "@fluentui/react";
import { useCopyToClipboard } from "react-use";
import { useBoolean, useId } from "@fluentui/react-hooks";

import { useCqlFormat } from "pages/Explore/utils/hooks/useStacFilter";
import createPythonSnippet from "./pythonSnippet";
import { HUB_URL } from "utils/constants";
import NewTabLink from "components/controls/NewTabLink";

const ExploreInHub = () => {
  const theme = useTheme();
  const copyToClipboard = useCopyToClipboard()[1];
  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("callout-button");
  const labelId = useId("callout-label");
  const descriptionId = useId("callout-description");
  const cql = useCqlFormat();
  const snippet = createPythonSnippet(cql);

  return (
    <Stack
      styles={{
        root: {
          padding: 6,
          borderTop: "1px solid",
          borderColor: theme.palette.neutralLighter,
        },
      }}
    >
      <PrimaryButton id={buttonId} onClick={toggle}>
        Explore results in the Hub
      </PrimaryButton>

      {isCalloutVisible && snippet && (
        <Callout
          ariaLabelledBy={labelId}
          ariaDescribedBy={descriptionId}
          role="alertdialog"
          className={styles.callout}
          gapSpace={6}
          target={`#${buttonId}`}
          onDismiss={toggle}
          setInitialFocus
          isBeakVisible={false}
          directionalHint={DirectionalHint.rightBottomEdge}
        >
          <Stack>
            <Text block className={styles.title}>
              Explore results
            </Text>
            <Text styles={{ root: { paddingBottom: 6 } }}>
              Use the code below to recreate this search in the Planetary Computer
              Hub or other Python analytic environment.
            </Text>
            <StackItem>
              <Stack
                horizontal
                horizontalAlign={"start"}
                tokens={{ childrenGap: 6 }}
              >
                <DefaultButton
                  iconProps={{ iconName: "Copy" }}
                  onClick={() => copyToClipboard(snippet)}
                >
                  Copy
                </DefaultButton>
                <NewTabLink
                  As={PrimaryButton}
                  href={HUB_URL}
                  title="This example can be launched in the Planetary Computer Hub"
                >
                  Launch Hub
                </NewTabLink>
              </Stack>
            </StackItem>
          </Stack>

          <div className="input_area">
            <pre>{snippet}</pre>
          </div>
        </Callout>
      )}
    </Stack>
  );
};

const theme = getTheme();
const styles = mergeStyleSets({
  callout: {
    maxWidth: 700,
    padding: "20px 24px",
    backgroundColor: theme.semanticColors.bodyBackground,
  },
  title: {
    fontSize: FontSizes.mediumPlus,
    fontWeight: FontWeights.semibold,
    padding: "6px 0",
  },
});

export default ExploreInHub;
