import { useEffect } from "react";

export function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}
