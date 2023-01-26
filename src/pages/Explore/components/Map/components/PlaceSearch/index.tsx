import { useCallback, useRef } from "react";
import { Text, FontWeights, Separator } from "@fluentui/react";
import PanelControl, { PanelControlHandlers } from "../PanelControl";

import { AddressPicker, PlaceSearchProps } from "./types";
import usePlaceSuggestions from "./usePlaceSuggestions";

const PlaceSearchControl = ({ mapRef }: PlaceSearchProps) => {
  //Handle closing the panel when the search is complete
  const panelRef = useRef<PanelControlHandlers>(null);
  const togglePanel = useCallback(() => {
    panelRef.current?.togglePanel();
  }, []);

  const handlers = usePlaceSuggestions(togglePanel, mapRef);

  return (
    <PanelControl
      ref={panelRef}
      label="Search for places on the map"
      top={106}
      iconName="FluentSearch"
    >
      <Text block styles={{ root: { fontWeight: FontWeights.bold } }}>
        Place Finder
      </Text>
      <Text block>Find and navigate to an address, place, or region</Text>
      <Separator />
      <AddressPicker
        inputProps={{ placeholder: "Search for place or address" }}
        resolveDelay={300}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested locations",
          noResultsFoundText: "Sorry, nothing matched your search ",
          searchingText: "Searching...",
        }}
        onResolveSuggestions={handlers.resolveSuggestions}
        onRenderSuggestionsItem={handlers.renderSuggestion}
        onRenderItem={handlers.renderItem}
        onItemSelected={handlers.handleItemSelected}
      />
    </PanelControl>
  );
};

export default PlaceSearchControl;
