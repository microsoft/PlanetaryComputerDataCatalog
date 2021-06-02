import React, { useState, useCallback, useMemo, useEffect } from "react";
import { SearchBox, TagPicker } from "@fluentui/react";
import { filter } from "../../utils/filter";
import { useQueryString } from "../../utils/hooks";
import { useHistory } from "react-router-dom";

const stacKeys = ["title", "msft:short_description", "description", "keywords"];
const datasetKeys = ["title", "description", "tags"];

const DatasetFilter = ({
  tags,
  stacCollection,
  datasets,
  onStacMatch,
  onDatasetMatch,
}) => {
  const history = useHistory();
  const [filterTerm, setFilterTerm] = useState("");
  const qsTags = useQueryString().get("tags");

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

  const preselectedTags = useMemo(() => {
    return qsTags ? qsTags.split(",").map(t => ({ key: t, name: t })) : [];
  }, [qsTags]);

  const handleTextChange = useCallback(
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

  const handleTagsChange = useCallback(
    selectedTags => {
      onStacMatch(
        stacCollection.filter(c =>
          selectedTags.every(({ key }) => c.keywords?.includes(key))
        )
      );
      onDatasetMatch(
        datasets.filter(d =>
          selectedTags.every(({ key }) => d.tags?.includes(key))
        )
      );

      // Persist the tags to the querystring for browser navigation and link sharing
      const qs = selectedTags.length
        ? `tags=${selectedTags.map(({ key }) => key)}`
        : null;
      history.push({ search: qs });
    },
    [history, onDatasetMatch, onStacMatch, datasets, stacCollection]
  );

  const filterSuggestedTags = useCallback(
    // Offer list of suggested tags based on input text and non-existance
    // in the list of existing items. Use the key property for all comparisons.
    (inputText, selectedTags) => {
      return inputText
        ? tags.filter(
            ({ key }) =>
              key.includes(inputText.toLowerCase()) &&
              !selectedTags.some(({ key: existingKey }) => existingKey === key)
          )
        : [];
    },
    [tags]
  );

  useEffect(() => {
    handleTagsChange(preselectedTags);
  }, [preselectedTags, handleTagsChange]);

  return (
    <>
      <TagPicker
        inputProps={{
          placeholder: "Filter by tags",
        }}
        removeButtonAriaLabel="Remove tag"
        selectionAriaLabel="Selected tags"
        onResolveSuggestions={filterSuggestedTags}
        getTextFromItem={({ name }) => name}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested tags",
          noResultsFoundText: "No matching tags found",
        }}
        onChange={handleTagsChange}
        defaultSelectedItems={preselectedTags}
      />
      {false && (
        <SearchBox
          placeholder="Filter datasets"
          value={filterTerm}
          onChange={handleTextChange}
        />
      )}
    </>
  );
};

export default DatasetFilter;
