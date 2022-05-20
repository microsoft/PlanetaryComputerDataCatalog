import React, { createContext, useState, useEffect } from "react";
import { useAuthRefresh, useAuthStatus } from "./useAuthRefresh";

type Session = {
  isLoggedIn: boolean;
  email: string;
  token: string | null;
};

type SessionContextType = {
  status: Session;
  logout: () => void;
};

const initialSession: Session = {
  isLoggedIn: false,
  email: "",
  token: null,
};

const initialContext = {
  status: initialSession,
  logout: () => {},
};

const DEFAULT_REFERESH_MS = 1 * 1000 * 60;
const SessionContext = createContext<SessionContextType>(initialContext);

export const SessionProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState<Session>(initialSession);
  const [refreshInterval, setRefreshInterval] = useState(0);

  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useAuthStatus();
  const {
    data: refreshData,
    isLoading: isRefreshLoading,
    isError: isRefreshError,
  } = useAuthRefresh(refreshInterval);

  // Turn off the refresh interval when the request fails (will be a 401)
  if (isRefreshError && refreshInterval !== 0) {
    setSession(initialSession);
    setRefreshInterval(0);
  }

  useEffect(() => {
    if (isRefreshLoading) return;

    setSession(refreshData || initialSession);

    // Not logged in, cease polling/refreshing
    if (!refreshData?.isLoggedIn) {
      setRefreshInterval(0);
    }
  }, [isRefreshLoading, refreshData]);

  useEffect(() => {
    if (isStatusLoading) return;

    if (isStatusError) {
      setSession(initialSession);
      return;
    }

    if (!statusData?.isLoggedIn) {
      setSession(statusData);
    }

    // Logged in but not polling for refresh, start polling for refresh
    if (statusData?.isLoggedIn && refreshInterval === 0) {
      setRefreshInterval(DEFAULT_REFERESH_MS);
    }
  }, [isStatusError, isStatusLoading, refreshInterval, statusData]);

  const context = {
    status: session,
    logout: () => {
      setSession(initialSession);
    },
  };
  return (
    <SessionContext.Provider value={context}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
