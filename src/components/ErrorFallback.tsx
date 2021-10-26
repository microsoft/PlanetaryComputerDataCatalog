import {
  IMessageBarStyles,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";

const ErrorFallback = () => {
  return (
    <MessageBar isMultiline styles={styles} messageBarType={MessageBarType.error}>
      <Text>
        Sorry, something went wrong when trying to display this information.
      </Text>
    </MessageBar>
  );
};

export const CardErrorFallback = () => {
  return <div></div>;
};

export default ErrorFallback;

const styles: IMessageBarStyles = {
  root: { paddingBottom: "6px", borderRadius: 4 },
};
