import { render } from "testUtils";
import nock from "nock";

import { STAC_URL } from "utils/constants";
import { Catalog } from "../Catalog.index";

const defaultConfig: Record<string, DatasetEntry> = {
  red: { category: "Color" },
  blue: { category: "Color" },
  one: { category: "Number" },
  two: { category: "Number" },
  "two-a": { category: "Number" },
};

const defaultNonApiConfig: Record<string, StorageDatasetEntry> = {
  cat: {
    category: "animal",
    title: "Cat",
    keywords: ["cat"],
    infoUrl: "",
    thumbnailUrl: "",
    short_description: "",
  },
};

const defaultCollectionsResponse = {
  collections: [
    { id: "red", title: "This is Red", keywords: ["red"] },
    { id: "blue", title: "This is Blue", keywords: ["blue"] },
    { id: "one", title: "This is One", keywords: ["Uno"] },
    { id: "two", title: "This is Two", keywords: ["Dos"] },
    { id: "two-a", title: "This is Two-A", keywords: ["Dos"] },
  ],
};

const setup = (
  groups: Record<string, DatasetGroup> = {},
  featuredIds: string[] = []
) => {
  const apiUrl = new URL(STAC_URL as string);
  const httpScope = nock(apiUrl.origin)
    .get(`${apiUrl.pathname}/collections`)
    .reply(200, defaultCollectionsResponse);

  const utils = render(
    <Catalog />,
    {},
    {
      collectionConfig: defaultConfig,
      groupConfig: groups,
      featuredIds,
      storageCollectionConfig: defaultNonApiConfig,
    }
  );

  return {
    httpScope,
    ...utils,
  };
};

test("Catalog renders full list when no filter is present", () => {
  const { getByLabelText, queryAllByText, queryByTestId } = setup();
  expect(getByLabelText("Dataset category navigation")).toBeInTheDocument();
  expect(queryAllByText("Featured")).toHaveLength(2);

  expect(queryByTestId("catalog-filter-results")).not.toBeInTheDocument();
});

test("Catalog renders only search results when filter is present in query string", () => {
  // Update the query string to include filter before rendering the component
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      ...window.location,
      search: "?filter=red",
    },
  });

  const { queryByLabelText, getByTestId, queryByText } = setup();

  expect(getByTestId("catalog-filter-results")).toBeInTheDocument();

  expect(queryByLabelText("Dataset category navigation")).not.toBeInTheDocument();
  expect(queryByText("Featured")).not.toBeInTheDocument();
});
