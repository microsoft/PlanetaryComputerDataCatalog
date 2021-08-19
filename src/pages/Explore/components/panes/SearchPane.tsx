import { useEffect, useState } from "react";
import * as atlas from "azure-maps-control";
import {
  DatePicker,
  Dropdown,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
} from "@fluentui/react";
import dayjs from "dayjs";

import { IStacSearch, IStacSearchResult } from "types/stac";

import { useStacSearch } from "utils/stacSearch";
import QueryPane from "./QueryPane";
import { useExploreSelector } from "../state/hooks";

type PickerPaneProps = {
  mapRef: React.MutableRefObject<atlas.Map | null>;
  onResults: (stacSearchResult: IStacSearchResult | undefined) => void;
};

const defaultStart = dayjs().subtract(1, "year").toDate();

const SearchPane = ({ mapRef, onResults }: PickerPaneProps) => {
  const [start, setStart] = useState<Date>(defaultStart);
  const [end, setEnd] = useState<Date>(new Date());
  const [itemId, setItemId] = useState<string>();
  const [limit, setLimit] = useState<number>(25);
  const [search, setSearch] = useState<IStacSearch | undefined>();

  const { collection } = useExploreSelector(s => s.mosaic);

  const { isLoading: isSearchLoading, data: searchResponse } = useStacSearch(search);

  useEffect(() => {
    // Azure Maps styling is requring a field on properties to filter on for hover
    // Copy over the stac Id to the properties
    searchResponse?.features.forEach(f => {
      if (f.properties) {
        f.properties["stacId"] = f.id;
      }
    });

    console.log("results:", searchResponse);
    onResults(searchResponse);
  }, [searchResponse, onResults]);

  const handleSearch = (): void => {
    const s = dayjs(start);
    const e = dayjs(end);
    const bbox = mapRef.current?.getCamera().bounds;

    if (bbox && collection) {
      const sw = atlas.data.BoundingBox.getSouthWest(bbox);
      const ne = atlas.data.BoundingBox.getNorthEast(bbox);

      setSearch({
        collections: [collection?.id ?? ""],
        bbox: [sw[0], sw[1], ne[0], ne[1]],
        datetime: `${s.format("YYYY-MM-DD")}/${e.format("YYYY-MM-DD")}`,
        items: itemId?.trim() ? itemId.split(",").map(i => i.trim()) : undefined,
        limit: limit,
      });
    }
  };

  return (
    <>
      <div>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DatePicker
            label="Start"
            value={start}
            onSelectDate={setStart as (date: Date | null | undefined) => void}
            ariaLabel="Select a start date"
            allowTextInput
          />
          <DatePicker
            label="End"
            value={end}
            onSelectDate={setEnd as (date: Date | null | undefined) => void}
            ariaLabel="Select a end date"
            allowTextInput
          />
        </Stack>
        {false && (
          <TextField
            label="Item IDs (optional)"
            placeholder={`STAC IDs from ${collection?.id ?? "collection"}`}
            value={itemId}
            onChange={(_, newValue) => setItemId(newValue)}
          />
        )}

        {false && (
          <Dropdown
            label="Limit"
            options={[25, 50, 100, 250, 500, 1000].map(i => ({
              key: `limit${i}`,
              text: i.toLocaleString(),
              data: i,
            }))}
            selectedKey={`limit${limit}`}
            onChange={(_, option) => option?.data && setLimit(parseInt(option.data))}
          />
        )}
        {collection && <QueryPane collectionId={collection?.id} />}
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <PrimaryButton
            text="Search"
            onClick={handleSearch}
            styles={{ root: { marginTop: 10 } }}
          />
          {isSearchLoading && (
            <Spinner size={SpinnerSize.large} styles={{ root: { marginTop: 10 } }} />
          )}
        </Stack>
      </div>
      <div style={{ height: "100%" }}>
        {/* <SearchResults results={searchResponse} isError={isSearchError} /> */}
      </div>
    </>
  );
};

export default SearchPane;
