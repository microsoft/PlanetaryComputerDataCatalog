import React, { useImperativeHandle } from "react";
import { getTheme, Callout, DirectionalHint, IconButton } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";

interface PanelControlProps {
  label: string;
  iconName: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface PanelControlHandlers {
  togglePanel: () => void;
}

const PanelControl = React.forwardRef<
  PanelControlHandlers,
  React.PropsWithChildren<PanelControlProps>
>(
  (
    {
      label,
      iconName,
      children,
      top = undefined,
      bottom = undefined,
      left = undefined,
      right = 2,
    },
    ref
  ) => {
    const theme = getTheme();
    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
    const buttonId = useId("callout-button");
    const r = left ? undefined : right;
    const buttonStyle = { top, bottom, left, right: r, ...controlStyle };

    // Expose the toggle handle
    useImperativeHandle(ref, () => ({
      togglePanel: () => {
        toggleIsCalloutVisible();
      },
    }));

    const panelDir = left ? DirectionalHint.rightCenter : DirectionalHint.leftCenter;
    return (
      <div style={buttonStyle}>
        <IconButton
          id={buttonId}
          ariaLabel={label}
          title={label}
          styles={{ icon: { color: theme.semanticColors.bodyText } }}
          className="azure-maps-control-button"
          iconProps={{ iconName: iconName }}
          onClick={toggleIsCalloutVisible}
        />
        {isCalloutVisible && (
          <Callout
            styles={calloutStyle}
            directionalHint={panelDir}
            onDismiss={toggleIsCalloutVisible}
            target={`#${buttonId}`}
            isBeakVisible={false}
            setInitialFocus
          >
            {children}
          </Callout>
        )}
      </div>
    );
  }
);

export default PanelControl;

const controlStyle: React.CSSProperties = {
  zIndex: 1,
  position: "absolute",
  display: "flex",
  margin: 8,
  background: getTheme().semanticColors.bodyBackground,
  borderCollapse: "collapse",
  borderRadius: getTheme().effects.roundedCorner2,
  boxShadow: "rgb(0 0 0 / 16%) 0 0 4px",
};

const calloutStyle = {
  calloutMain: {
    width: 320,
    padding: "6px 6px",
  },
};
