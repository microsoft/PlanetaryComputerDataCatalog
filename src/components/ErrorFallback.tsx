import {
  IMessageBarStyles,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";

const ErrorFallback = () => {
  return (
    <MessageBar
      isMultiline
      styles={errorMessageStyles}
      messageBarType={MessageBarType.error}
    >
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

export const handleErrorBoundaryError = (
  error: Error,
  info: { componentStack: string }
) => {
  console.error(error);
};

export const errorMessageStyles: IMessageBarStyles = {
  root: { borderRadius: 4 },
};
