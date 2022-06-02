import { waitForElementToBeRemoved, within } from "@testing-library/react";
import nock from "nock";

import { render } from "testUtils";
import { STAC_URL } from "utils/constants";
import { CatalogCollectionList } from "../Catalog.CollectionList";

const defaultConfig: Record<string, DatasetEntry> = {
  red: { category: "Color" },
  blue: { category: "Color" },
  one: { category: "Number" },
  two: { category: "Number" },
  "two-a": { category: "Number" },
};

const defaultNonApiConfig: Record<string, NonApiDatasetEntry> = {
  panda: {
    category: "Animal",
    title: "Non-API Panda",
    short_description: "Non-API 1 Panda description",
    keywords: ["animal"],
    infoUrl: "https://example.com/non-api-1",
    thumbnailUrl: "https://example.com/non-api-1.png",
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

const defaultSetFilter = () => {};
const setup = (
  setFilterText: (text: string | undefined) => void = defaultSetFilter,
  groups: Record<string, DatasetGroup> = {},
  featuredIds: string[] = []
) => {
  const apiUrl = new URL(STAC_URL as string);
  const httpScope = nock(apiUrl.origin)
    .get(`${apiUrl.pathname}/collections`)
    .reply(200, defaultCollectionsResponse);

  const utils = render(
    <CatalogCollectionList
      collectionConfig={defaultConfig}
      nonApiCollectionConfig={defaultNonApiConfig}
      datasetGroups={groups}
      featuredDatasetIds={featuredIds}
      setFilterText={setFilterText}
    />
  );
  return {
    httpScope,
    ...utils,
  };
};

test("Catalog renders collections by category", async () => {
  const { queryAllByTestId, getByTestId } = setup();

  await waitForElementToBeRemoved(
    () => queryAllByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  const colorCat = getByTestId("catalog-category-section-Color");
  expect(colorCat).toBeInTheDocument();
  expect(colorCat).toHaveTextContent("Color");
  expect(within(colorCat).getAllByTestId("catalog-collection-item")).toHaveLength(2);

  const numberCat = getByTestId("catalog-category-section-Number");
  expect(numberCat).toBeInTheDocument();
  expect(numberCat).toHaveTextContent("Number");
  expect(within(numberCat).getAllByTestId("catalog-collection-item")).toHaveLength(
    3
  );

  const animalCat = getByTestId("catalog-category-section-Animal");
  expect(animalCat).toBeInTheDocument();
  expect(animalCat).toHaveTextContent("Animal");
  expect(within(animalCat).getAllByTestId("catalog-collection-item")).toHaveLength(
    1
  );
});

test("Catalog adds featured from collection", async () => {
  const { queryAllByTestId, getByTestId } = setup(defaultSetFilter, {}, ["two-a"]);

  await waitForElementToBeRemoved(
    () => queryAllByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  const featCat = getByTestId("catalog-category-section-Featured");
  expect(featCat).toBeInTheDocument();
  expect(featCat).toHaveTextContent("Featured");

  const featured = within(featCat).getByTestId("catalog-collection-item");
  expect(featured).toHaveTextContent("This is Two-A");
});

test("Catalog adds featured from groups", async () => {
  const groupsTwos: Record<string, DatasetGroup> = {
    "two-like": {
      title: "Things like two",
      description: "A list of collections that are like two",
      short_description: "A list of collections that are like two",
      keywords: ["two"],
      assets: {
        thumbnail: {
          href: "https://example.com/two.png",
        },
        headerImg: {
          href: "https://example.com/two.png",
        },
      },
    },
  };
  const { queryAllByTestId, getByTestId } = setup(defaultSetFilter, groupsTwos, [
    "two-like",
  ]);

  await waitForElementToBeRemoved(
    () => queryAllByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  const featCat = getByTestId("catalog-category-section-Featured");
  expect(featCat).toBeInTheDocument();
  expect(featCat).toHaveTextContent("Featured");

  const featured = within(featCat).getByTestId("catalog-collection-item");
  expect(featured).toHaveTextContent("Things like two");
});
