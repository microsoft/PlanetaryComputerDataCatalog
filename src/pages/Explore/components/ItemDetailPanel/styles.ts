import { mergeStyleSets, getTheme, FontSizes } from "@fluentui/react";

const theme = getTheme();

export const headerButtonStyle = mergeStyleSets({
  root: {
    float: "right",
    top: -32,
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    backgroundColor: theme.semanticColors.bodyBackground,
    border: "1px solid",
    borderColor: theme.palette.themePrimary,
  },
  icon: {
    fontSize: FontSizes.size24,
  },
});

export const checkedHeaderButtonStyle = mergeStyleSets({
  ...headerButtonStyle,
  iconChecked: {
    color: theme.semanticColors.bodyBackground,
  },
  rootChecked: {
    backgroundColor: theme.palette.accent,
    borderColor: theme.palette.neutralLight,
  },
  rootCheckedHovered: {
    backgroundColor: theme.palette.themeSecondary,
  },
});
