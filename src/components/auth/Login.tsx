import { Link, Text } from "@fluentui/react";
import { useSession } from "./hooks/SessionContext";

const Login: React.FC = () => {
  const session = useSession();
  const login = (
    <>
      <Text>or, </Text>
      <Link href="/api/auth/login">Sign in</Link>
    </>
  );

  return !session.loggedIn ? login : null;
};

export default Login;
