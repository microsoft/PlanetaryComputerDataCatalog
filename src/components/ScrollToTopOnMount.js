import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTopOnMount() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [hash]);

  return null;
}
