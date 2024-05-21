import { useCallback, useState } from "react";
import {
  Callout,
  DirectionalHint,
  FontWeights,
  FontSizes,
  Stack,
  mergeStyleSets,
  getTheme,
  Text,
  DefaultButton,
  StackItem,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { useCopyToClipboard } from "react-use";

import NewTabLink from "components/controls/NewTabLink";
import { useCqlFormat } from "pages/Explore/utils/hooks/useStacFilter";
import { createCqlPythonSnippet, createItemPythonSnippet } from "./pythonSnippet";
import { useExploreSelector } from "pages/Explore/state/hooks";

interface Props {
  visible: boolean;
  buttonId: string;
  onDismiss: () => void;
  snippetType?: "query" | "item";
}

const SnippetCopyPanel = ({
  visible,
  buttonId,
  onDismiss,
  snippetType = "query",
}: Props) => {
  const labelId = useId("callout-label");
  const descriptionId = useId("callout-description");
  const [clipboardState, copyToClipboard] = useCopyToClipboard();
  const [isRecentCopy, setIsRecentCopy] = useState<boolean>(false);
  const cql = useCqlFormat();
  const item = useExploreSelector(s => s.detail.selectedItem);
  const snippet =
    snippetType === "query"
      ? createCqlPythonSnippet(cql)
      : createItemPythonSnippet(item);
  const title =
    snippetType === "query" ? (
      <>
        <Text>
          Use the code below to recreate this search in any Python analytic
          environments. Read more about searching using the{" "}
          <NewTabLink href="https://github.com/radiantearth/stac-api-spec/tree/master/fragments/filter#overview">
            STAC API
          </NewTabLink>
          .
        </Text>
      </>
    ) : (
      "Use the code below to access this individual item's data assets."
    );

  const isCopySuccess = clipboardState.value && isRecentCopy;

  // Briefly change the copy button icon when a user copies to indicate success
  const copyIcon = isCopySuccess ? "SkypeCheck" : "Copy";
  const copyIconColor = isCopySuccess
    ? theme.palette.green
    : theme.palette.neutralPrimary;

  const handleCopy = useCallback(() => {
    if (!snippet?.code) return;
    setIsRecentCopy(true);
    copyToClipboard(snippet.code);
    setTimeout(() => setIsRecentCopy(false), 3000);
  }, [copyToClipboard, snippet]);

  if (!visible || !snippet) return null;

  return (
    <Callout
      ariaLabelledBy={labelId}
      ariaDescribedBy={descriptionId}
      role="alertdialog"
      className={styles.callout}
      gapSpace={6}
      target={`#${buttonId}`}
      onDismiss={onDismiss}
      setInitialFocus
      isBeakVisible={false}
      directionalHint={DirectionalHint.rightBottomEdge}
    >
      <Stack tokens={{ childrenGap: 6 }}>
        <Text block className={styles.title}>
          Explore results
        </Text>
        <Text>{title}</Text>
        <StackItem>
          <Stack horizontal horizontalAlign={"start"} tokens={{ childrenGap: 6 }}>
            <DefaultButton
              styles={{ icon: { color: copyIconColor } }}
              iconProps={{ iconName: copyIcon }}
              onClick={handleCopy}
            >
              Copy
            </DefaultButton>
          </Stack>
        </StackItem>
        <StackItem>
          <div className="input_area" style={{ marginTop: 6 }}>
            <pre dangerouslySetInnerHTML={{ __html: snippet.value }} />
          </div>
        </StackItem>
      </Stack>
    </Callout>
  );
};

export default SnippetCopyPanel;

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
  },
});
