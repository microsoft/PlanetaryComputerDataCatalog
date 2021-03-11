import { useLocation } from "react-router-dom";

export const useQueryString = () => {
  return new URLSearchParams(useLocation().search);
};
