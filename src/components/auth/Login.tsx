import { Link, Text } from "@fluentui/react";
import { AUTH_URL } from "utils/constants";
import { useSession } from "./hooks/SessionContext";

const Login: React.FC = () => {
  const { status } = useSession();
  const login = (
    <>
      <Text>or, </Text>
      <Link href={`${AUTH_URL}/auth/login`}>Sign in</Link>
    </>
  );

  return !status.isLoggedIn ? login : null;
};

export default Login;
