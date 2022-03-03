import { Spinner } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { loadDataFromQuery } from "pages/Explore/state/mosaicSlice";
import { useEffect } from "react";

const InitialStateLoader = () => {
  const dispatch = useExploreDispatch();
  const { isLoadingInitialState } = useExploreSelector(state => state.mosaic);

  useEffect(() => {
    dispatch(loadDataFromQuery(true));
  }, [dispatch]);

  if (isLoadingInitialState) {
    return <Spinner />;
  }
  return null;
};

export default InitialStateLoader;
