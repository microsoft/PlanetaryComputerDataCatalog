import {
  Stack,
  IStackTokens,
  ITextStyles,
  IVerticalDividerStyles,
  Text,
  VerticalDivider,
  StackItem,
  IStackStyles,
} from "@fluentui/react";
import { getTheme } from "@fluentui/style-utilities";

interface IDropdownLabelProps {
  label: string;
  displayValue: string | JSX.Element;
  title: string;
}

const DropdownLabel = ({ label, displayValue, title }: IDropdownLabelProps) => {
  return (
    <Stack
      key={`selector-label-${label}`}
      horizontal
      horizontalAlign="start"
      tokens={labelTokens}
      verticalAlign="center"
      styles={stackStyles}
    >
      <StackItem shrink={0}>
        <Text block nowrap styles={labelStyle} title={label}>
          {label}
        </Text>
      </StackItem>
      <VerticalDivider styles={labelDividerStyles} />
      <Text block nowrap title={title} styles={labelValueStyle}>
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

const stackStyles: Partial<IStackStyles> = {
  root: {
    width: "100%",
  },
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
