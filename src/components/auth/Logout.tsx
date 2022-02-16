import axios from "axios";
import { DefaultButton } from "@fluentui/react";
import { useMutation } from "react-query";

import { useSession } from "./hooks/SessionContext";
import { useEffect } from "react";

const Logout: React.FC = () => {
  const session = useSession();
  const mutation = useMutation(() => axios.post("./api/auth/logout"));

  const handleOnClick = () => {
    axios.get("./api/auth/logout/callback");
    // mutation.mutate();
  };
  const handleOnClick1 = () => {
    axios.post("./api/auth/logout/callback");
  };
  const handleOnClick2 = () => {
    axios.post("./api/auth/logout/callback?rc=302");
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      session.logout();
    }
  }, [mutation.isSuccess, session]);

  const logout = (
    <>
      <DefaultButton onClick={handleOnClick}>Sign out</DefaultButton>
      <DefaultButton onClick={handleOnClick1}>Sign out</DefaultButton>
      <DefaultButton onClick={handleOnClick2}>Sign out</DefaultButton>
    </>
  );

  return session.status.isLoggedIn ? logout : null;
};

export default Logout;
