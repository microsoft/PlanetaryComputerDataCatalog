import { Link } from "@fluentui/react";
import { useSession } from "./hooks/SessionContext";

const Logout: React.FC = () => {
  const session = useSession();
  const handleOnClick = () => {};

  const logout = (
    <Link href="/api/auth/logout" onClick={handleOnClick}>
      Sign out
    </Link>
  );

  return session.loggedIn ? logout : null;
};

export default Logout;
