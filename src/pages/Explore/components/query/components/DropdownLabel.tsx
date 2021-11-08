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
      key={`selector-label-${label}`}
      horizontal
      horizontalAlign="start"
      tokens={labelTokens}
      verticalAlign="center"
    >
      <Text block nowrap styles={labelStyle} title={label}>
        {label}
      </Text>
      <VerticalDivider styles={labelDividerStyles} />
      <Text block nowrap title={displayValue} styles={labelValueStyle}>
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

const labelDividerStyles: IVerticalDividerStyles = {
  divider: {
    height: 29,
    background: theme.palette.neutralTertiaryAlt,
  },
  wrapper: {},
};

const labelStyle: ITextStyles = {
  root: {
    paddingRight: 5,
    width: 100,
    textAlign: "left",
    fontWeight: 500,
  },
};

const labelValueStyle: ITextStyles = {
  root: {
    paddingLeft: 5,
    textAlign: "left",
  },
};
