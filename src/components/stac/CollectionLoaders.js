import {
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";

export const errorMsg = (
  <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
    Sorry, we're having trouble loading these datasets right now
  </MessageBar>
);

export const loadingMsg = (
  <div
    style={{
      display: "flex",
      width: "100%",
      minHeight: 300,
      justifyContent: "center",
    }}
  >
    <Spinner size={SpinnerSize.large} />
  </div>
);
