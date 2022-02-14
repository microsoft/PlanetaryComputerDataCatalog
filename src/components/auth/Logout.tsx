import axios from "axios";
import { DefaultButton } from "@fluentui/react";
import { useMutation } from "react-query";

import { useSession } from "./hooks/SessionContext";

const Logout: React.FC = () => {
  const session = useSession();
  const mutation = useMutation(() => axios.post("./api/auth/logout"));

  const handleOnClick = () => {
    mutation.mutate();
  };

  const logout = <DefaultButton onClick={handleOnClick}>Sign out</DefaultButton>;

  return session.isLoggedIn ? logout : null;
};

export default Logout;
