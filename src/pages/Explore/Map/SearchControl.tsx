import React from "react";
import {
  BasePickerListBelow,
  Callout,
  DirectionalHint,
  IBasePickerProps,
  IconButton,
  IPickerItemProps,
  useTheme,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import * as atlas from "azure-maps-control";
import axios from "axios";
import { useExploreDispatch } from "../state/hooks";
import { setCamera } from "../state/mapSlice";

const azMapsDomain = atlas.getDomain();
const searchType = "fuzzy";

interface PlaceSearchProps {
  mapRef: React.MutableRefObject<atlas.Map | null>;
}

export interface IAddressPickerProps extends IBasePickerProps<FuzzySearchResult> {}

class AddressPicker extends BasePickerListBelow<
  FuzzySearchResult,
  IAddressPickerProps
> {}

interface FuzzySearchResult {
  address: { freeformAddress: string };
  boundingBox: {
    btmRightPoint: { lat: number; lon: number };
    topLeftPoint: { lat: number; lon: number };
  };
  type: "Geography" | "Street" | "POI";
}

const PlaceSearchControl = ({ mapRef }: PlaceSearchProps) => {
  const theme = useTheme();
  const dispatch = useExploreDispatch();
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);

  const buttonId = useId("callout-button");

  const resolveSuggestions = async (query: string) => {
    if (!mapRef.current) return [];

    const geocodeServiceUrlTemplate = `https://${azMapsDomain}/search/${searchType}/json?typeahead=true&api-version=1&query=${query}`;
    const params = mapRef.current.authentication.signRequest({
      url: geocodeServiceUrlTemplate,
    });

    if (!params.url) return [];

    const suggests = await axios.get(params.url, { headers: params.headers });
    return suggests.data.results;
  };

  const renderSuggestion = (result: FuzzySearchResult) => {
    return <span style={{ padding: 4 }}>{result.address.freeformAddress}</span>;
  };
  const renderItem = ({ item }: IPickerItemProps<FuzzySearchResult>) => {
    return <span>{item.address.freeformAddress}</span>;
  };

  return (
    <div
      style={{
        zIndex: 1,
        position: "absolute",
        right: 2,
        top: 106,
        display: "flex",
        margin: 8,
        background: "#f1f1f1",
        borderCollapse: "collapse",
        borderRadius: theme.effects.roundedCorner2,
        boxShadow: "rgb(0 0 0 / 16%) 0 0 4px",
      }}
    >
      <IconButton
        id={buttonId}
        styles={{ icon: { color: theme.semanticColors.bodyText } }}
        className="azure-maps-control-button"
        iconProps={{ iconName: "Search" }}
        onClick={toggleIsCalloutVisible}
      />
      {isCalloutVisible && (
        <Callout
          styles={{
            calloutMain: {
              width: 320,
              padding: "6px 6px",
            },
          }}
          directionalHint={DirectionalHint.leftCenter}
          onDismiss={toggleIsCalloutVisible}
          target={`#${buttonId}`}
          isBeakVisible={false}
          setInitialFocus
        >
          <AddressPicker
            inputProps={{ placeholder: "Search for place or address" }}
            resolveDelay={300}
            onResolveSuggestions={resolveSuggestions}
            onRenderSuggestionsItem={renderSuggestion}
            onRenderItem={renderItem}
            onItemSelected={e => {
              const bounds = atlas.data.BoundingBox.fromLatLngs([
                e?.boundingBox.btmRightPoint as object,
                e?.boundingBox.topLeftPoint as object,
              ]);
              dispatch(setCamera({ bounds, padding: 20 }));
              toggleIsCalloutVisible();
              return null;
            }}
          />
        </Callout>
      )}
    </div>
  );
};

export default PlaceSearchControl;
