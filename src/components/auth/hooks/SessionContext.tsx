import React, { createContext, useState, useEffect } from "react";
import { useAuthRefresh, useAuthStatus } from "./useAuthRefresh";

type Session = {
  loggedIn: boolean;
  email: string;
};

const initialSession: Session = {
  loggedIn: false,
  email: "",
};

const DEFAULT_REFERESH_MS = 1 * 60 * 1000;
const SessionContext = createContext<Session>(initialSession);

export const SessionProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState<Session>(initialSession);
  const [refreshInterval, setRefreshInterval] = useState(0);

  const { data: statusData, isLoading: isStatusLoading } = useAuthStatus();
  const { data: refreshData, isLoading: isRefreshLoading } =
    useAuthRefresh(refreshInterval);

  useEffect(() => {
    if (isRefreshLoading) return;

    setSession(refreshData || initialSession);

    // Not logged in, cease polling/refreshing
    if (!refreshData?.loggedIn) {
      setRefreshInterval(0);
    }
  }, [isRefreshLoading, refreshData]);

  useEffect(() => {
    if (isStatusLoading) return;
    setSession(statusData || initialSession);

    // Logged in but not polling for refresh, start polling for refresh
    if (statusData?.loggedIn && refreshInterval === 0) {
      setRefreshInterval(DEFAULT_REFERESH_MS);
    }
  }, [isStatusLoading, refreshInterval, statusData]);

  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
