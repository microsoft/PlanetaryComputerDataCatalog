import { MessageBar, MessageBarType } from "@fluentui/react";

const ErrorFallback = () => {
  return (
    <MessageBar messageBarType={MessageBarType.error}>
      Sorry, something went wrong when trying to display this information.
    </MessageBar>
  );
};

export const CardErrorFallback = () => {
  return <div></div>;
};

export default ErrorFallback;
