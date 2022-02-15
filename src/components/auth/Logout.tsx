import axios from "axios";
import { DefaultButton } from "@fluentui/react";
import { useMutation } from "react-query";

import { useSession } from "./hooks/SessionContext";
import { useEffect } from "react";

const Logout: React.FC = () => {
  const session = useSession();
  const mutation = useMutation(() => axios.post("./api/auth/logout"));

  const handleOnClick = () => {
    mutation.mutate();
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      session.logout();
    }
  }, [mutation.isSuccess, session]);

  const logout = <DefaultButton onClick={handleOnClick}>Sign out</DefaultButton>;

  return session.status.isLoggedIn ? logout : null;
};

export default Logout;
