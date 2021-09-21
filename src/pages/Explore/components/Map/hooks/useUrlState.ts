import { useEffect } from "react";
import { useExploreSelector } from "pages/Explore/state/hooks";
import { updateQueryStringParam } from "pages/Explore/utils";

export const centerKey = "c";
export const zoomKey = "z";

const useUrlState = () => {
  const { center, zoom } = useExploreSelector(state => state.map);

  useEffect(() => {
    updateQueryStringParam(centerKey, center.map(n => n.toFixed(4)).join(","));
  }, [center]);

  useEffect(() => {
    updateQueryStringParam(zoomKey, zoom.toFixed(2));
  }, [zoom]);
};

export default useUrlState;
