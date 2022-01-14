import { useState, useCallback, useMemo, useEffect } from "react";
import { SearchBox, TagPicker } from "@fluentui/react";
import { filter, stacTagFilter, tagFilter } from "utils/filter";
import { useQueryString } from "utils/hooks";
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

  // Turn a querystring representation of tags into tag items to be preset on the picker
  const preselectedTags = useMemo(() => {
    return qsTags
      ? qsTags.split(",").map(t => ({ key: t.toLocaleLowerCase(), name: t }))
      : [];
  }, [qsTags]);

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

  // Filter collections and datasets with the selected tags
  const handleTagsChange = useCallback(
    selectedTags => {
      onStacMatch(stacTagFilter(stacCollection, selectedTags));
      onDatasetMatch(tagFilter(datasets, selectedTags));

      // Persist the tags to the querystring for browser navigation and link sharing
      const qs = selectedTags.length
        ? `tags=${selectedTags.map(({ name }) => name)}`
        : null;
      history.push({ search: qs });
    },
    [history, onDatasetMatch, onStacMatch, datasets, stacCollection]
  );

  // Is a key present in selectedTags
  const keySelected = (key, selectedTags) =>
    selectedTags.some(({ key: existingKey }) => existingKey === key);

  // Offer list of suggested tags based on input text and non-existence
  // in the list of existing items. Use the key property for all comparisons.
  const filterSuggestedTags = useCallback(
    (inputText, selectedTags) => {
      return inputText
        ? tags.filter(
            ({ key }) =>
              key.includes(inputText.toLowerCase()) &&
              !keySelected(key, selectedTags)
          )
        : [];
    },
    [tags]
  );

  // Return the first n tags in alpha order which aren't already selected
  const topUnselectedTags = selectedTags =>
    tags.filter(({ key }) => !keySelected(key, selectedTags)).slice(0, 50);

  // When tags are first parsed from the querystring, initiate the filter mechanism
  useEffect(() => {
    handleTagsChange(preselectedTags);
  }, [preselectedTags, handleTagsChange]);

  return (
    <div>
      <TagPicker
        selectedItems={preselectedTags}
        onChange={handleTagsChange}
        onEmptyInputFocus={topUnselectedTags}
        onResolveSuggestions={filterSuggestedTags}
        getTextFromItem={({ name }) => name}
        inputProps={{
          placeholder: "Filter by tags",
          "aria-label": "Filter by tags",
        }}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested tags",
          noResultsFoundText: "No matching tags found",
        }}
        removeButtonAriaLabel="Remove tag"
        selectionAriaLabel="Selected tags"
      />
      {false && (
        // TODO: Remove this and related when we are sure we don't want it
        <SearchBox
          placeholder="Filter datasets"
          value={filterTerm}
          onChange={handleTextChange}
        />
      )}
    </div>
  );
};

export default DatasetFilter;
