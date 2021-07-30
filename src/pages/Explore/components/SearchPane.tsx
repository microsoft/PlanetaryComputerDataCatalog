import { useEffect, useState } from "react";
import * as atlas from "azure-maps-control";
import {
  DatePicker,
  Dropdown,
  Icon,
  IDropdownOption,
  IDropdownProps,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
} from "@fluentui/react";
import dayjs from "dayjs";

import { IStacCollection, IStacSearch, IStacSearchResult } from "types/stac";
import { useCollections } from "utils/requests";
import { useStacSearch } from "utils/stacSearch";
import SearchResults from "./SearchResults";
import QueryPane from "./QueryPane";

type PickerPaneProps = {
  mapRef: React.MutableRefObject<atlas.Map | null>;
  onResults: (stacSearchResult: IStacSearchResult | undefined) => void;
};

const defaultStart = dayjs().subtract(1, "year").toDate();

const SearchPane = ({ mapRef, onResults }: PickerPaneProps) => {
  const [selectedCollection, setSelectedCollection] = useState<
    IDropdownOption | undefined
  >();
  const [start, setStart] = useState<Date>(defaultStart);
  const [end, setEnd] = useState<Date>(new Date());
  const [itemId, setItemId] = useState<string>();
  const [limit, setLimit] = useState<number>(50);
  const [search, setSearch] = useState<IStacSearch | undefined>();

  const { isSuccess, data: stacResponse } = useCollections();
  const {
    isError: isSearchError,
    isLoading: isSearchLoading,
    data: searchResponse,
  } = useStacSearch(search);

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

    if (bbox && selectedCollection) {
      const sw = atlas.data.BoundingBox.getSouthWest(bbox);
      const ne = atlas.data.BoundingBox.getNorthEast(bbox);

      setSearch({
        collections: [selectedCollection.key.toString() ?? ""],
        bbox: [sw[0], sw[1], ne[0], ne[1]],
        datetime: `${s.format("YYYY-MM-DD")}/${e.format("YYYY-MM-DD")}`,
        items: itemId?.trim() ? itemId.split(",").map(i => i.trim()) : undefined,
        limit: limit,
      });
    }
  };

  const collectionChange = (_: any, option: IDropdownOption | undefined): void => {
    if (option) {
      const collections: IStacCollection[] = stacResponse.collections;
      const collection = collections.find(c => c.id === option.key);

      if (collection) {
        const timeRange = collection?.extent.temporal.interval[0];
        const collectionStart = dayjs(timeRange[0]);
        const collectionEnd = dayjs(timeRange[1] ?? undefined);

        if (
          dayjs(start).isBefore(collectionStart) ||
          dayjs(start).isAfter(collectionEnd)
        ) {
          setStart(collectionStart.toDate());
        }
        if (dayjs(end).isBefore(collectionStart)) {
          setEnd(collectionEnd.toDate());
        }
      }
    }

    onResults(undefined);
    setSelectedCollection(option);
  };

  const iconStyles = { marginRight: "8px" };
  const onRenderTitle = (
    options: IDropdownOption[] | undefined
  ): JSX.Element | null => {
    if (!options) return null;

    const option = options[0];

    return (
      <div>
        <Icon
          style={iconStyles}
          iconName="AddOnlineMeeting"
          aria-hidden="true"
          title={option.title}
        />
        <span>{option.text}</span>
      </div>
    );
  };
  const onRenderPlaceholder = (props: IDropdownProps | undefined): JSX.Element => {
    return (
      <div>
        <Icon style={iconStyles} iconName="AddOnlineMeeting" aria-hidden="true" />
        <span>Select a dataset</span>
      </div>
    );
  };

  const collectionOptions = isSuccess
    ? (stacResponse?.collections as IStacCollection[])
        .filter(collection => !("cube:variables" in collection))
        .map((collection): IDropdownOption => {
          return { key: collection.id, text: collection.title };
        })
    : [];

  return (
    <div>
      <p>Explore Planetary Computer datasets.</p>
      <Dropdown
        options={collectionOptions}
        selectedKey={selectedCollection ? selectedCollection.key : undefined}
        onChange={collectionChange}
        onRenderTitle={onRenderTitle}
        onRenderPlaceholder={onRenderPlaceholder}
        ariaLabel="Selected dataset"
      />
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

      <TextField
        label="Item IDs (optional)"
        placeholder={`STAC IDs from ${
          selectedCollection ? selectedCollection.key : "collection"
        }`}
        value={itemId}
        onChange={(_, newValue) => setItemId(newValue)}
      />

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
      {selectedCollection && (
        <QueryPane collectionId={selectedCollection.key.toString()} />
      )}

      <SearchResults results={searchResponse} isError={isSearchError} />
    </div>
  );
};

export default SearchPane;
