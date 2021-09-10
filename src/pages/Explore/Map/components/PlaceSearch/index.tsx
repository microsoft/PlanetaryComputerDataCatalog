import {
  getTheme,
  Callout,
  DirectionalHint,
  IconButton,
  Text,
  useTheme,
  FontWeights,
  Separator,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";

import { AddressPicker, PlaceSearchProps } from "./types";
import usePlaceSuggestions from "./usePlaceSuggestions";

const PlaceSearchControl = ({ mapRef }: PlaceSearchProps) => {
  const theme = useTheme();
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const handlers = usePlaceSuggestions(toggleIsCalloutVisible, mapRef);
  const buttonId = useId("callout-button");

  return (
    <div style={controlStyle}>
      <IconButton
        id={buttonId}
        ariaLabel="Search for places on the map"
        title="Search for places on the map"
        styles={{ icon: { color: theme.semanticColors.bodyText } }}
        className="azure-maps-control-button"
        iconProps={{ iconName: "Search" }}
        onClick={toggleIsCalloutVisible}
      />
      {isCalloutVisible && (
        <Callout
          styles={calloutStyle}
          directionalHint={DirectionalHint.leftCenter}
          onDismiss={toggleIsCalloutVisible}
          target={`#${buttonId}`}
          isBeakVisible={false}
          setInitialFocus
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
        </Callout>
      )}
    </div>
  );
};

export default PlaceSearchControl;

const controlStyle: React.CSSProperties = {
  zIndex: 1,
  position: "absolute",
  right: 2,
  top: 106,
  display: "flex",
  margin: 8,
  background: "#f1f1f1",
  borderCollapse: "collapse",
  borderRadius: getTheme().effects.roundedCorner2,
  boxShadow: "rgb(0 0 0 / 16%) 0 0 4px",
};

const calloutStyle = {
  calloutMain: {
    width: 320,
    padding: "6px 6px",
  },
};
