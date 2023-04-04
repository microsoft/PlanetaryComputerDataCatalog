import { Icon } from "@fluentui/react";
import NewTabLink from "components/controls/NewTabLink";
import { ChatCommand } from "../ChatCommand";

interface MoreInfoCommandProps {
  collectionId: string;
}

export const MoreInfoCommand = ({ collectionId }: MoreInfoCommandProps) => {
  return (
    <ChatCommand>
      <NewTabLink
        href={`//${window.location.host}/dataset/${collectionId}`}
        title="See full dataset description"
      >
        More info <Icon iconName="NavigateExternalInline" />
      </NewTabLink>
    </ChatCommand>
  );
};
