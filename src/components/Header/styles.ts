import { mergeStyles, getTheme } from "@fluentui/react";

const theme = getTheme();

export const headerStyle = mergeStyles({
  padding: "11px 0",
  background: theme.semanticColors.bodyBackground,
  borderBottom: "1px solid rgb(237, 235, 233)",
});

export const innerHeaderStyle = mergeStyles({
  margin: "0",
  padding: "0",
  "@media (max-width: 900px)": {
    display: "none",
  },
});

export const smallHeaderStyle = mergeStyles({
  "@media (min-width: 900px)": {
    display: "none",
  },
});

export const logoLinkStyle = mergeStyles({
  width: "113px",
  outlineOffset: "-2px",
  display: "flex",
  alignItems: "center",
});

export const logoImageStyle = mergeStyles({
  maxWidth: "none",
  width: "108px",
  lineHeight: "1",
});

export const headerPipeStyle = mergeStyles({
  marginTop: "0px !important",
  marginLeft: "7px !important",
  marginRight: "14px !important",
  fontSize: "23.5px",
  fontWeight: 500,
  lineHeight: "1",
});

export const productNameStyle = mergeStyles({
  marginLeft: "-3px !important",
  fontWeight: "600",
});

/* Tablet size main header will break on first header link to new line */
export const breakStyle = mergeStyles({
  flexBasis: "100%",
  height: "0",
  margin: "0",
  "@media (min-width: 1023px)": {
    display: "none",
  },
});

export const rightAligned = mergeStyles({
  marginLeft: "auto !important",
});
