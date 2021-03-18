import { Stack } from "@fluentui/react";
import React from "react";
import { Link } from "react-router-dom";

const HeaderLink = ({ to, children }) => {
  return (
    <Stack.Item align={"center"}>
      <Link
        to={to}
        style={{
          fontSize: "14px",
          lineHeight: "16px",
          color: "#000",
          textDecoration: "none",
        }}
      >
        {children}
      </Link>
    </Stack.Item>
  );
};

export default HeaderLink;
