import React from "react";
import { useHistory } from "react-router-dom";
import { DefaultButton, IButtonProps } from "@fluentui/react";

type Props = {
  to: string;
} & Omit<IButtonProps, "href">;

const ButtonLink: React.FC<Props> = ({ to, ...rest }) => {
  const history = useHistory();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    history.push(to);
  };

  return <DefaultButton href={to} onClick={handleClick} {...rest} />;
};

export default ButtonLink;
