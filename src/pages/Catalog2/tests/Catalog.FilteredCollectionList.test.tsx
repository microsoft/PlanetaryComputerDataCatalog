import { render, within } from "testUtils";
import nock from "nock";
import { STAC_URL } from "utils/constants";
import { CatalogFilteredCollectionList } from "../Catalog.FilteredCollectionList";
import { waitForElementToBeRemoved } from "@testing-library/react";

const setup = (
  filterText: string | undefined = undefined,
  handleFn: (text: string | undefined) => void = () => {}
) => {
  const apiUrl = new URL(STAC_URL as string);
  const httpScope = nock(apiUrl.origin)
    .get(`${apiUrl.pathname}/collections`)
    .reply(200, {
      collections: [
        { id: "foo", title: "This is Foo", keywords: ["red", "blue"] },
        { id: "bar", title: "This is Bar", keywords: ["purple", "blue"] },
      ],
    });

  const nonApiDatasets: Record<string, NonApiDatasetEntry> = {
    baz: {
      title: "This is Baz",
      category: "non-api",
      short_description: "Baz is a test entry for non-api dataset config",
      keywords: ["nonapi", "blue"],
      infoUrl: "",
      thumbnailUrl: "",
    },
  };

  const utils = render(
    <CatalogFilteredCollectionList
      filterText={filterText}
      setFilterText={handleFn}
      nonApiCollectionConfig={nonApiDatasets}
    />
  );

  return {
    httpScope,
    ...utils,
  };
};

test("Filter component renders loading indicators while collections load", async () => {
  const { httpScope, getByTestId, queryByTestId } = setup();

  expect(getByTestId("collection-loading-shimmers")).toBeInTheDocument();

  // Shimmer should be removed after collections load
  await waitForElementToBeRemoved(
    () => queryByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  // Make sure the mock was called
  httpScope.done();
});

test("Filter component matches title case insensitive", async () => {
  const { httpScope, queryByTestId } = setup("foo");

  // Shimmer should be removed after collections load
  await waitForElementToBeRemoved(
    () => queryByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  const results = queryByTestId("filtered-collection-results");
  expect(results).toBeInTheDocument();
  expect(results?.childElementCount).toBe(1);

  // Make sure the mock was called
  httpScope.done();
});

test("Filter component matches api keyword case insensitive", async () => {
  const { httpScope, queryByTestId } = setup("red");

  // Shimmer should be removed after collections load
  await waitForElementToBeRemoved(
    () => queryByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  const results = queryByTestId("filtered-collection-results");
  expect(results).toBeInTheDocument();
  expect(results?.childElementCount).toBe(1);

  // Make sure the mock was called
  httpScope.done();
});

test("Filter component matches non-api keyword case insensitive", async () => {
  const { httpScope, queryByTestId } = setup("nonapi");

  // Shimmer should be removed after collections load
  await waitForElementToBeRemoved(
    () => queryByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  const results = queryByTestId("filtered-collection-results");
  expect(results).toBeInTheDocument();
  expect(results?.childElementCount).toBe(1);

  // Make sure the mock was called
  httpScope.done();
});

test("Filter component matches multiple results", async () => {
  // All 3 test items have `blue`
  const { httpScope, getByTestId } = setup("blue");

  // Shimmer should be removed after collections load
  await waitForElementToBeRemoved(() => getByTestId("collection-loading-shimmers"), {
    timeout: 5000,
  });

  const results = getByTestId("filtered-collection-results");
  expect(results).toBeInTheDocument();
  expect(results?.childElementCount).toBe(1);
  expect(within(results).getAllByTestId("catalog-collection-item")).toHaveLength(3);

  // Make sure the mock was called
  httpScope.done();
});

test("Filter component show messages with no results", async () => {
  const { httpScope, queryByTestId } = setup("aqua");

  // Shimmer should be removed after collections load
  await waitForElementToBeRemoved(
    () => queryByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  const results = queryByTestId("filtered-collection-results");
  expect(results).not.toBeInTheDocument();

  const noResults = queryByTestId("no-filtered-collection-results");
  expect(noResults).toBeInTheDocument();

  // Make sure the mock was called
  httpScope.done();
});
