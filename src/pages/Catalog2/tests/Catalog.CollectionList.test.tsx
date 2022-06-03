import { waitForElementToBeRemoved, within } from "@testing-library/react";
import nock from "nock";

import {
  defaultCollectionsConfig,
  defaultCollectionsResponse,
  defaultStorageConfig,
  render,
} from "testUtils";
import { STAC_URL } from "utils/constants";
import { CatalogCollectionList } from "../Catalog.CollectionList";

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
    <CatalogCollectionList setFilterText={setFilterText} />,
    {},
    {
      collectionConfig: defaultCollectionsConfig,
      storageCollectionConfig: defaultStorageConfig,
      groupConfig: groups,
      featuredIds,
    }
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
