import { Icon } from "@fluentui/react";
import NewTabLink from "components/controls/NewTabLink";
import { CSSProperties } from "react";
import { ChatCommand } from "../ChatCommand";

interface MoreInfoCommandProps {
  collectionId: string;
}

export const MoreInfoCommand = ({ collectionId }: MoreInfoCommandProps) => {
  return (
    <ChatCommand>
      <NewTabLink
        style={noUnderscoreLinkStyle}
        href={`//${window.location.host}/dataset/${collectionId}`}
        title={`See full dataset description for ${collectionId}`}
      >
        More info <Icon iconName="NavigateExternalInline" />
      </NewTabLink>
    </ChatCommand>
  );
};

const noUnderscoreLinkStyle: CSSProperties = {
  textDecoration: "none",
};
