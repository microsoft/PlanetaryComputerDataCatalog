import { useMsal } from "@azure/msal-react";
import { loginRequest } from "utils/helpers/auth";

import { DefaultButton } from "@fluentui/react";

export const SignInButton: React.FC = () => {
  const { instance } = useMsal();

  const handleClick = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.error(e);
    });
  };

  return <DefaultButton onClick={handleClick}>Sign In</DefaultButton>;
};
