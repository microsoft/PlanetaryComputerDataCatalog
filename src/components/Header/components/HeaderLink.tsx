import { Stack, mergeStyles } from "@fluentui/react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import ButtonLink from "../../controls/ButtonLink";

const linkStyle = mergeStyles({
  fontSize: "13px",
  lineHeight: "16px",
  color: "#000",
  marginTop: "3px",
  textDecoration: "none",
  selectors: {
    "&.active": {
      textDecoration: "underline",
      textDecorationThickness: "2px",
      textUnderlineOffset: "4px",
    },
  },
  ":hover": {
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "4px",
  },
});

const buttonStyle = mergeStyles({
  textDecoration: "none",
});

interface Props {
  to: string;
  external?: boolean;
  asButton?: boolean;
  isNav?: boolean;
  align?: "start" | "center" | "end";
}

const HeaderLink: React.FC<Props> = ({
  to,
  external = false,
  asButton = false,
  isNav = false,
  align = "center",
  children,
  ...rest
}) => {
  let link;
  if (external) {
    link = (
      <a href={to} className={linkStyle}>
        {children}
      </a>
    );
  } else if (asButton) {
    link = (
      <ButtonLink to={to} className={buttonStyle}>
        {children}
      </ButtonLink>
    );
  } else if (isNav) {
    link = (
      <NavLink to={to} className={linkStyle}>
        {children}
      </NavLink>
    );
  } else {
    link = (
      <Link to={to} className={linkStyle}>
        {children}
      </Link>
    );
  }

  return (
    <Stack.Item align={align} {...rest}>
      {link}
    </Stack.Item>
  );
};

export default HeaderLink;
