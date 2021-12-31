import { mergeStyles, Theme } from "@fluentui/react";

export const headerStyleFactory = (theme: Theme) =>
  mergeStyles({
    padding: "0 11px",
    background: theme.semanticColors.bodyBackground,
    boxShadow: "0 0 1px rgb(0 0 0 / 64%)",
    position: "relative",
    zIndex: 1,
  });

export const innerHeaderStyle = mergeStyles({
  margin: "0",
  padding: "10px 0 16px",
  /* When header links are on a new line, add some padding to the bottom of the header */
  "@media (max-width: 1023px)": {
    paddingBottom: "10px",
  },
});

export const logoLinkStyle = mergeStyles({
  width: "113px",
  outlineOffset: "-2px",
  display: "flex",
  alignItems: "center",
});

export const logoImageStyle = mergeStyles({
  marginTop: "-1px !important",
  maxWidth: "none",
  width: "108px",
  lineHeight: "1",
});

export const headerPipeStyle = mergeStyles({
  marginTop: "0px !important",
  marginLeft: "9px !important",
  fontSize: "23.5px",
  fontWeight: 500,
  lineHeight: "1",
});

export const productNameStyle = mergeStyles({
  marginLeft: "-3px !important",
  fontWeight: "600",
  ":hover": {
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "4px",
  },
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
