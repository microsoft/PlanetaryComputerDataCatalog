import { Stack, mergeStyles } from "@fluentui/react";
import React from "react";
import { Link } from "react-router-dom";
import ButtonLink from "../../controls/ButtonLink";

const linkStyle = mergeStyles({
  fontSize: "13px",
  lineHeight: "16px",
  color: "#000",
  marginTop: "3px",
});

const buttonStyle = mergeStyles({
  textDecoration: "none",
});

interface Props {
  to: string;
  external?: boolean;
  asButton?: boolean;
}

const HeaderLink: React.FC<Props> = ({
  to,
  external = false,
  asButton = false,
  children,
  ...rest
}) => {
  const link = external ? (
    <a href={to} className={linkStyle}>
      {children}
    </a>
  ) : asButton ? (
    <ButtonLink to={to} className={buttonStyle}>
      {children}
    </ButtonLink>
  ) : (
    <Link to={to} className={linkStyle}>
      {children}
    </Link>
  );
  return (
    <Stack.Item align={"center"} {...rest}>
      {link}
    </Stack.Item>
  );
};

export default HeaderLink;
