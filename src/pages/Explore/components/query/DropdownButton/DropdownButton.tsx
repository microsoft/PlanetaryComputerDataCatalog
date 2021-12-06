import React, { useCallback, useImperativeHandle } from "react";
import {
  Callout,
  DefaultButton,
  DirectionalHint,
  Icon,
  IIconStyles,
  IStackStyles,
  Stack,
  getTheme,
  IButtonStyles,
  IButtonProps,
  mergeStyleSets,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { PanelControlHandlers } from "../../Map/components/PanelControl";

interface DropdownButtonProps extends IButtonProps {
  label: string;
  directionalHint?: DirectionalHint;
  onDismiss?: () => void;
}

export const DropdownButton = React.forwardRef<
  PanelControlHandlers,
  React.PropsWithChildren<DropdownButtonProps>
>(
  (
    {
      label,
      directionalHint = DirectionalHint.bottomLeftEdge,
      onDismiss,
      children,
      ...rest
    },
    ref
  ) => {
    const [isCalloutVisible, { toggle }] = useBoolean(false);
    const buttonId = useId("query-dropdown-button");
    const labelId = useId("query-dropdown-label");

    // Expose the toggle handle
    useImperativeHandle(ref, () => ({
      togglePanel: () => {
        toggle();
      },
    }));

    const handleDismiss = useCallback(() => {
      toggle();
      onDismiss && onDismiss();
    }, [onDismiss, toggle]);

    return (
      <>
        <Stack
          styles={stackStyle}
          aria-label={`${label} selector`}
          aria-haspopup="dialog"
        >
          <DefaultButton
            id={buttonId}
            styles={buttonStyles}
            onClick={handleDismiss}
            {...rest}
          />
          <Icon iconName="ChevronDown" styles={chevronStyle} />
        </Stack>
        {isCalloutVisible && (
          <Callout
            role="dialog"
            className={styles.callout}
            ariaLabelledBy={labelId}
            gapSpace={0}
            target={`#${buttonId}`}
            onDismiss={handleDismiss}
            directionalHint={directionalHint}
            isBeakVisible={false}
            setInitialFocus
          >
            {children}
          </Callout>
        )}
      </>
    );
  }
);

const theme = getTheme();

const stackStyle: IStackStyles = {
  root: {
    position: "relative",
    width: "100%",
  },
};
const buttonStyles: Partial<IButtonStyles> = {
  flexContainer: {
    justifyContent: "start",
  },
  root: {
    paddingLeft: 8,
    paddingRight: 30,
  },
};

const chevronStyle: IIconStyles = {
  root: {
    position: "absolute",
    top: 1,
    right: 8,
    height: 32,
    lineHeight: 30,
    fontSize: 12,
    color: theme.palette.neutralSecondary,
    pointerEvents: "none",
    cursor: "pointer",
  },
};

const styles = mergeStyleSets({
  callout: {
    padding: "2px 2px",
    backgroundColor: theme.semanticColors.bodyBackground,
  },
});
