import { Link, Text } from "@fluentui/react";
import axios from "axios";
import { useMutation } from "react-query";
import { useSession } from "./hooks/SessionContext";

const Login: React.FC = () => {
  const session = useSession();
  const mutation = useMutation(() => axios.post("./api/auth/login"));

  const handleOnClick = () => {
    mutation.mutate();
  };

  const login = (
    <>
      <Text>or, </Text>
      <Link onClick={handleOnClick}>Sign in</Link>
    </>
  );

  return !session.isLoggedIn ? login : null;
};

export default Login;
