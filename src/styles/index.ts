import { mergeStyles } from "@fluentui/react";

export const boldStyle = { root: { fontWeight: 500 } };
export const marginVStyle = { root: { marginTop: 20, marginBottom: 20 } };
export const paddingVStyle = {
  root: { paddingBottom: "1.2rem", paddingTop: "1.2em" },
};

export const gridContentStyle = mergeStyles({
  "@media (min-width: 1080px)": {
    paddingLeft: "5% !important",
    paddingRight: "5% !important",
  },
  "@media (max-width: 1079px)": {
    paddingLeft: "20px !important",
    paddingRight: "20px !important",
  },
});

export const offGridContentStyle = mergeStyles({
  "@media (min-width: 1080px)": {
    paddingRight: "5% !important",
  },
  "@media (max-width: 1079px)": {
    paddingRight: "20px !important",
  },
});
