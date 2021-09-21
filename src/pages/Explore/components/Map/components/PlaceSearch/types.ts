import * as atlas from "azure-maps-control";
import { BasePickerListBelow, IBasePickerProps } from "@fluentui/react";

export interface PlaceSearchProps {
  mapRef: React.MutableRefObject<atlas.Map | null>;
}

export interface IAddressPickerProps extends IBasePickerProps<FuzzySearchResult> {}

export class AddressPicker extends BasePickerListBelow<
  FuzzySearchResult,
  IAddressPickerProps
> {}

export interface FuzzySearchResult {
  address: {
    countryCode: string;
    countryCodeISO3: string;
    freeformAddress: string;
  };
  viewport: {
    btmRightPoint: { lat: number; lon: number };
    topLeftPoint: { lat: number; lon: number };
  };
  type: "Geography" | "Street" | "POI";
  poi?: { name: string };
}
