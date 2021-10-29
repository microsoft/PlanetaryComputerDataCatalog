import {
  Stack,
  IStackTokens,
  ITextStyles,
  IVerticalDividerStyles,
  Text,
  VerticalDivider,
} from "@fluentui/react";
import { getTheme } from "@fluentui/style-utilities";

interface IDropdownLabelProps {
  label: string;
  displayValue: string;
}

const DropdownLabel = ({ label, displayValue }: IDropdownLabelProps) => {
  return (
    <Stack
      key="datetime-selector-label"
      horizontal
      horizontalAlign="start"
      tokens={labelTokens}
      verticalAlign="center"
    >
      <Text block nowrap styles={labelStyle} title={label}>
        {label}
      </Text>
      <VerticalDivider styles={labelDividerStyles} />
      <Text block nowrap title={displayValue}>
        {displayValue}
      </Text>
    </Stack>
  );
};

export default DropdownLabel;

const theme = getTheme();
export const labelTokens: IStackTokens = {
  childrenGap: 4,
};
export const labelDividerStyles: IVerticalDividerStyles = {
  divider: {
    height: 29,
    background: theme.palette.neutralTertiaryAlt,
  },
  wrapper: {},
};
export const labelStyle: ITextStyles = {
  root: {
    paddingRight: 5,
    width: 85,
    textAlign: "left",
  },
};
