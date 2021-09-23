import { StackItem, Toggle } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "pages/Explore/state/hooks";
import { setUseHighDef } from "pages/Explore/state/mapSlice";

const HighDefTilesToggle = () => {
  const dispatch = useExploreDispatch();
  const { useHighDef } = useExploreSelector(s => s.map);

  return (
    <StackItem>
      <Toggle
        label="Use high definition map tiles"
        checked={useHighDef}
        onChange={(_, checked) => dispatch(setUseHighDef(checked || false))}
      />
    </StackItem>
  );
};

export default HighDefTilesToggle;
