import { Stack } from "@fluentui/react";
import React from "react";
import { Link } from "react-router-dom";
import ButtonLink from "./ButtonLink";

const HeaderLink = ({
  to,
  external = false,
  asButton = false,
  style,
  children,
}) => {
  const defaultStyle = { marginTop: "0px", marginLeft: "14px" };
  const linkStyle = {
    fontSize: "13px",
    lineHeight: "16px",
    color: "#000",
    marginTop: "3px",
  };
  const link = external ? (
    <a href={to} style={linkStyle}>
      {children}
    </a>
  ) : asButton ? (
    <ButtonLink to={to} style={{ textDecoration: "none" }}>
      {children}
    </ButtonLink>
  ) : (
    <Link to={to} style={linkStyle}>
      {children}
    </Link>
  );
  return (
    <Stack.Item align={"center"} style={style || defaultStyle}>
      {link}
    </Stack.Item>
  );
};

export default HeaderLink;
