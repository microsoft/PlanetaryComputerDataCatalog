import { IMessageBarStyles, MessageBar, MessageBarType } from "@fluentui/react";
import { AxiosError } from "axios";

interface ImageErrorProps {
  error: AxiosError<any, any>;
}

export const ImageError: React.FC<ImageErrorProps> = ({ error }) => {
  if (!error) return null;

  const { response } = error;
  const errorText =
    response?.status === 400
      ? response?.data.error
      : "Sorry, something went wrong with that request.";
  return (
    <MessageBar styles={errorBarStyles} messageBarType={MessageBarType.error}>
      {errorText}
    </MessageBar>
  );
};

const errorBarStyles: IMessageBarStyles = {
  root: {
    marginTop: 10,
  },
};
