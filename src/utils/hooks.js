import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useQueryString = () => {
  const location = useLocation();
  const [params, setParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    setParams(new URLSearchParams(location.search));
  }, [location]);

  return params;
};
