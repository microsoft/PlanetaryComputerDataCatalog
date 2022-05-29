import { render } from "testUtils";
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

  const utils = render(
    <CatalogFilteredCollectionList
      filterText={filterText}
      setFilterText={handleFn}
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

test("Filter component matches keyword case insensitive", async () => {
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

test("Filter component matches multiple results", async () => {
  const { httpScope, queryByTestId } = setup("blue");

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
