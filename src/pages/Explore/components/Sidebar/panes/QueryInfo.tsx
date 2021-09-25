import {
  Callout,
  IconButton,
  Stack,
  Text,
  mergeStyleSets,
  FontWeights,
  Separator,
  StackItem,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";

import { useExploreSelector } from "pages/Explore/state/hooks";
import { stacFormatter } from "utils/stac";
import { operators } from "../../query/constants";

const QueryInfo = () => {
  const { query, collection } = useExploreSelector(s => s.mosaic);
  const [isCalloutVisible, { toggle }] = useBoolean(false);
  const buttonId = useId("queryinfo-button");
  const labelId = useId("queryinfo-label");

  const collectionTitle = (
    <Stack>
      <Text styles={{ root: { fontWeight: FontWeights.bold } }}>
        {collection?.title}
      </Text>
      <Text>{collection?.["msft:short_description"]}</Text>
      <Separator />
    </Stack>
  );

  const expressionLabel = (expression: any) => {
    const op = Object.keys(expression)[0] as keyof typeof operators;
    const [attr, value] = expression[op];
    const property = stacFormatter.label(attr.property);
    const opText = operators[op];

    return (
      <Text>
        {property} {opText} {value}
      </Text>
    );
  };

  const queryBody = query.cql?.map(expressionLabel);

  return (
    <StackItem>
      <IconButton
        id={buttonId}
        iconProps={{ iconName: "Info" }}
        title="Current query description"
        ariaLabel="Current query description"
        onClick={toggle}
      />
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          role="alertdialog"
          gapSpace={0}
          target={`#${buttonId}`}
          onDismiss={toggle}
          setInitialFocus
        >
          {collectionTitle}
          {queryBody}
        </Callout>
      )}
    </StackItem>
  );
};
export default QueryInfo;

const styles = mergeStyleSets({
  callout: {
    width: 420,
    padding: "20px 24px",
  },
});
