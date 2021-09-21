import { IconButton, TooltipHost } from "@fluentui/react";
import { useId, useConst, useBoolean } from "@fluentui/react-hooks";

import SnippetCopyPanel from "../ExploreInHub/SnippetCopyPanel";
import { headerButtonStyle } from "./styles";

const ItemSnippetButton = () => {
  const tooltipId = useId("tooltip");
  const buttonId = useId("targetButton");
  const [isCalloutVisible, { toggle }] = useBoolean(false);

  const label = "Show a code snippet to access this item's data assets";

  const calloutProps = useConst({
    gapSpace: 0,
    target: `#${buttonId}`,
  });

  return (
    <>
      <TooltipHost content={label} calloutProps={calloutProps}>
        <IconButton
          id={buttonId}
          onClick={toggle}
          iconProps={{ iconName: "Code" }}
          ariaLabel={label}
          aria-describedby={tooltipId}
          styles={headerButtonStyle}
        />
      </TooltipHost>
      <SnippetCopyPanel
        snippetType="item"
        buttonId={buttonId}
        visible={isCalloutVisible}
        onDismiss={toggle}
      />
    </>
  );
};

export default ItemSnippetButton;
