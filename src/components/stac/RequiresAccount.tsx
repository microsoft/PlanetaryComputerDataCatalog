import { useStac } from "./CollectionContext";
import {
  IMessageBarStyles,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";
import { Link } from "react-router-dom";

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
        A Planetary Computer account is required to access the data assets in this
        dataset.{" "}
        <Link to="/docs/concepts/sas/#when-an-account-is-needed">
          See documentation.
        </Link>
      </Text>
    </MessageBar>
  );
};

export default RequiresAccount;

const messageBarStyles: IMessageBarStyles = {
  root: {
    padding: "4px 2px",
    borderRadius: 4,
  },
};
