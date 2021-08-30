import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEvent } from "react-use";
import * as qs from "query-string";

import { IStacCollection } from "types/stac";
import { useCollections } from "utils/requests";
import { useExploreDispatch } from "../state/hooks";
import { setCollection } from "../state/mosaicSlice";
import { setCamera } from "../state/mapSlice";

const FrameController = () => {
  const dispatch = useExploreDispatch();
  const { isSuccess, data } = useCollections();
  const collections: IStacCollection[] = data?.collections;

  const query = useLocation().search;
  const params = qs.parse(query);
  const [msg, setMsg] = useState(params["collection"]);

  useEffect(() => {
    if (params.bbox && !Array.isArray(params.bbox)) {
      const bbox = params.bbox.split(",").map(coord => parseFloat(coord));
      dispatch(setCamera({ bounds: bbox }));
    }
  }, [dispatch, params.bbox]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const msg = event.data;
      if (msg.collection) {
        setMsg(msg.collection);
      } else if (msg.bbox) {
        dispatch(setCamera({ bounds: msg.bbox }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (isSuccess) {
      if (collections) {
        const collection = collections.find(c => c.id === msg);
        if (collection) {
          dispatch(setCollection(collection));
          console.log("set collection");
        }
      }
    }
  }, [isSuccess, collections, msg, dispatch]);

  useEvent("message", handleMessage);

  return null;
};

export default FrameController;
