import { MessageBar, MessageBarType, Link } from "@fluentui/react";
import { useState, useEffect } from "react";
import { messageBarStyle } from "../styles";

const sessionStorageKey = "pcProMessageDismissed";

export function PlanetaryComputerProAnnouncement() {
  const [isDismissed, setIsDismissed] = useState(false);
  useEffect(() => {
    const dismissed = sessionStorage.getItem(sessionStorageKey);
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);
  const onDismiss = () => {
    sessionStorage.setItem(sessionStorageKey, "true");
    setIsDismissed(true);
  };
  if (isDismissed) {
    return null;
  }
  return (
    <MessageBar
      messageBarType={MessageBarType.success}
      isMultiline={true}
      dismissButtonAriaLabel="Close"
      onDismiss={onDismiss}
      className={messageBarStyle}
    >
      Announcing Microsoft Planetary Computer Pro - Bring the power of the Planetary
      Computer to your private geospatial data.
      <Link href="https://aka.ms/planetarycomputerpro" target="_blank" underline>
        Click here to learn more
      </Link>
    </MessageBar>
  );
}
