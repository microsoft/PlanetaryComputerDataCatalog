import React, { useState, useCallback, useMemo } from "react";
import { SearchBox } from "@fluentui/react";
import { filter } from "../../utils/filter";

const stacKeys = ["title", "msft:short_description", "description", "keywords"];
const datasetKeys = ["title", "description"];

const DatasetFilter = ({
  stacCollection,
  datasets,
  onStacMatch,
  onDatasetMatch,
}) => {
  const [filterTerm, setFilterTerm] = useState("");

  // Index the stac collection results for filtering
  const stacFilter = useMemo(() => {
    return filter(stacCollection, stacKeys);
  }, [stacCollection]);

  const datasetFilter = useMemo(() => {
    return filter(datasets, datasetKeys);
  }, [datasets]);

  // When new text is entered, search the index and return
  // matching items.
  const runFilter = (newValue, filterFn, defaultDataObj) => {
    const result = filterFn(newValue);
    return newValue.length === 0 ? defaultDataObj : result;
  };

  const handleChange = useCallback(
    (_, newValue) => {
      setFilterTerm(newValue);
      onStacMatch(runFilter(newValue, stacFilter, stacCollection));
      onDatasetMatch(runFilter(newValue, datasetFilter, datasets));
    },
    [
      stacFilter,
      datasetFilter,
      onDatasetMatch,
      onStacMatch,
      datasets,
      stacCollection,
    ]
  );

  return (
    <SearchBox
      placeholder="Filter datasets"
      value={filterTerm}
      onChange={handleChange}
    />
  );
};

export default DatasetFilter;
