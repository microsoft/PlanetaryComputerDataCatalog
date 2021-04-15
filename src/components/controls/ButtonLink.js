import React from "react";
import { useHistory } from "react-router-dom";
import { DefaultButton } from "@fluentui/react";

const ButtonLink = ({ to, style, title = "", children }) => {
  const history = useHistory();

  const handleClick = e => {
    e.preventDefault();
    history.push(to);
  };
  return (
    <DefaultButton href={to} style={style} title={title} onClick={handleClick}>
      {children}
    </DefaultButton>
  );
};

export default ButtonLink;
