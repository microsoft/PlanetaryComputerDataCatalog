import { useStac } from "./CollectionContext";
import {
  IMessageBarStyles,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";
import { Link } from "react-router-dom";
import { highContrastLinkColor } from "pages/StorageCollectionDetail/StorageCollectionDetail.index";

const RequiresAccount = () => {
  const collection = useStac();

  if (!collection?.["msft:requires_account"]) return null;

  return (
    <MessageBar
      data-cy="msft-acct-req-msg"
      styles={messageBarStyles}
      messageBarType={MessageBarType.info}
    >
      <Text>
        A Planetary Computer account is required to access the assets in this
        dataset.{" "}
        <Link
          style={highContrastLinkColor}
          to="/docs/concepts/sas/#when-an-account-is-needed"
        >
          See documentation.
        </Link>
      </Text>
    </MessageBar>
  );
};

export default RequiresAccount;

export const messageBarStyles: IMessageBarStyles = {
  root: {
    padding: "4px 2px",
    borderRadius: 4,
  },
};
