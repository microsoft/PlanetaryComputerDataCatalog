import { IMessageBarStyles, MessageBar, MessageBarType } from "@fluentui/react";
import { AxiosError } from "axios";

interface ImageErrorProps {
  error: AxiosError<any, any>;
}

export const ImageExportError: React.FC<ImageErrorProps> = ({ error }) => {
  if (!error) return null;

  const { response } = error;
  const msg = "Sorry, something went wrong with that request.";
  const errorText = response?.status === 400 ? response?.data.error || msg : msg;
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
