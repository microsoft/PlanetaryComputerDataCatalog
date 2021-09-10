import { MutableRefObject, useCallback } from "react";
import * as atlas from "azure-maps-control";
import axios from "axios";
import { isEmpty } from "lodash-es";
import { IPickerItemProps, Text, useTheme, FontSizes } from "@fluentui/react";
import { IUseBooleanCallbacks } from "@fluentui/react-hooks";

import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCamera } from "../../../state/mapSlice";
import { FuzzySearchResult } from "./types";

const azMapsDomain = atlas.getDomain();
const searchType = "fuzzy";

const usePlaceSuggestions = (
  toggleIsCalloutVisible: IUseBooleanCallbacks["toggle"],
  mapRef: MutableRefObject<atlas.Map | null>
) => {
  const theme = useTheme();
  const dispatch = useExploreDispatch();

  const handleItemSelected = useCallback(
    (selectedItem: FuzzySearchResult | undefined) => {
      if (!selectedItem) return null;

      const bounds = atlas.data.BoundingBox.fromLatLngs([
        selectedItem.viewport.btmRightPoint as object,
        selectedItem.viewport.topLeftPoint as object,
      ]);

      dispatch(setCamera({ bounds, padding: 20 }));
      toggleIsCalloutVisible();

      // We're not using the result to display anything, so null clears it. The action
      // is taken through the dispatch above.
      return null;
    },
    [dispatch, toggleIsCalloutVisible]
  );

  const resolveSuggestions = async (query: string) => {
    if (!mapRef.current || isEmpty(query) || query.length <= 2) return [];

    const geocodeServiceUrlTemplate = `https://${azMapsDomain}/search/${searchType}/json?typeahead=true&api-version=1&query=${query}`;
    const params = mapRef.current.authentication.signRequest({
      url: geocodeServiceUrlTemplate,
    });

    if (!params.url) return [];

    try {
      const suggests = await axios.get(params.url, { headers: params.headers });
      return suggests.data.results;
    } catch {
      return [];
    }
  };

  const formatAddress = (address: FuzzySearchResult["address"]) =>
    `${address.freeformAddress}, ${address.countryCodeISO3} `;

  const renderSuggestion = (result: FuzzySearchResult) => {
    const outerStyle = { padding: 6 };
    let text = null;
    switch (result.type) {
      case "Geography":
      case "Street":
      default:
        text = <Text style={outerStyle}>{formatAddress(result.address)}</Text>;
        break;

      case "POI":
        text = (
          <>
            <Text style={outerStyle}>{result.poi?.name}</Text>{" "}
            <Text
              styles={{
                root: {
                  color: theme.palette.neutralSecondary,
                  fontSize: FontSizes.smallPlus,
                },
              }}
            >
              {formatAddress(result.address)}
            </Text>
          </>
        );
        break;
    }

    return text;
  };

  const renderItem = ({ item }: IPickerItemProps<FuzzySearchResult>) => {
    return <span>{item.address.freeformAddress}</span>;
  };

  return {
    renderItem,
    renderSuggestion,
    handleItemSelected,
    resolveSuggestions,
  };
};

export default usePlaceSuggestions;
