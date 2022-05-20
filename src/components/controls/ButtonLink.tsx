import React from "react";
import { useNavigate } from "react-router-dom";
import { DefaultButton, IButtonProps } from "@fluentui/react";

type Props = {
  to: string;
} & Omit<IButtonProps, "href">;

const ButtonLink: React.FC<Props> = ({ to, ...rest }) => {
  const navigate = useNavigate();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    navigate(to);
  };

  return <DefaultButton href={to} onClick={handleClick} {...rest} />;
};

export default ButtonLink;
