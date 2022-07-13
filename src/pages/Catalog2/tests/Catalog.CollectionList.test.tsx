import { waitForElementToBeRemoved, within } from "@testing-library/react";
import nock from "nock";

import {
  defaultCollectionsConfig,
  defaultCollectionsResponse,
  defaultStorageConfig,
  render,
} from "testUtils";
import { IStacCollection } from "types/stac";
import { STAC_URL } from "utils/constants";
import { CatalogCollectionList } from "../Catalog.CollectionList";

const defaultSetFilter = () => {};

const collectionsWithGroup = {
  collections: [
    {
      id: "red",
      title: "This is Red",
      keywords: ["red"],
      "msft:group_id": "colors",
    },
    {
      id: "blue",
      title: "This is Blue",
      keywords: ["blue"],
      "msft:group_id": "colors",
    },
    { id: "one", title: "This is One", keywords: ["Uno"] },
  ],
};

const groups: Record<string, DatasetGroup> = {
  colors: {
    title: "Color Group",
    description: "A list of colors",
    short_description: "A list of colors",
    keywords: ["color"],
    assets: {
      thumbnail: { href: "https://example.com/color.png" },
      headerImg: { href: "https://example.com/color.png" },
    },
  },
};

const setup = (
  setFilterText: (text: string | undefined) => void = defaultSetFilter,
  groups: Record<string, DatasetGroup> = {},
  featuredIds: string[] = [],
  collectionResponse: { collections: {} } = defaultCollectionsResponse,
  preFilterFn: (collection: IStacCollection) => boolean = () => true,
  includeStorageCollections: boolean = true
) => {
  const apiUrl = new URL(STAC_URL as string);
  const httpScope = nock(apiUrl.origin)
    .get(`${apiUrl.pathname}/collections`)
    .reply(200, collectionResponse);

  const utils = render(
    <CatalogCollectionList
      setFilterText={setFilterText}
      preFilterCollectionFn={preFilterFn}
      includeStorageDatasets={includeStorageCollections}
    />,
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

test("Catalog combines grouped collections when key is present", async () => {
  const { queryAllByTestId, getByText, queryByText } = setup(
    defaultSetFilter,
    groups,
    [],
    collectionsWithGroup
  );

  await waitForElementToBeRemoved(
    () => queryAllByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  expect(getByText("Color Group")).toBeInTheDocument();
  expect(getByText("This is One")).toBeInTheDocument();
  expect(queryByText("This is Blue")).not.toBeInTheDocument();
  expect(queryByText("This is Red")).not.toBeInTheDocument();
});

test("Catalog ignores group when configured to not group", async () => {
  const noGroupingGroups: Record<string, DatasetGroup> = {
    colors: {
      ...groups.colors,
      ...{
        groupOnCatalog: false,
      },
    },
  };

  const { queryAllByTestId, getByText, queryByText } = setup(
    defaultSetFilter,
    noGroupingGroups,
    [],
    collectionsWithGroup
  );

  await waitForElementToBeRemoved(
    () => queryAllByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  expect(queryByText("Color Group")).not.toBeInTheDocument();
  expect(getByText("This is One")).toBeInTheDocument();
  expect(queryByText("This is Blue")).toBeInTheDocument();
  expect(queryByText("This is Red")).toBeInTheDocument();
});

test("Catalog pre-filters collections", async () => {
  const filterFn = (collection: IStacCollection) =>
    collection.title === "This is One";
  const { queryAllByTestId, queryByTestId, getByTestId } = setup(
    defaultSetFilter,
    {},
    [],
    defaultCollectionsResponse,
    filterFn
  );

  await waitForElementToBeRemoved(
    () => queryAllByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  expect(queryByTestId("catalog-category-section-Color")).not.toBeInTheDocument();
  const numberSection = getByTestId("catalog-category-section-Number");
  expect(numberSection).toBeInTheDocument();
  expect(numberSection).toHaveTextContent("This is One");
  expect(numberSection).not.toHaveTextContent("This is Two");
});

test("Catalog does not include storage accounts when set", async () => {
  const { queryAllByTestId, queryByTestId } = setup(
    defaultSetFilter,
    undefined,
    undefined,
    defaultCollectionsResponse,
    undefined,
    false // <- don't include storage accounts
  );

  await waitForElementToBeRemoved(
    () => queryAllByTestId("collection-loading-shimmers"),
    { timeout: 5000 }
  );

  expect(queryByTestId("catalog-category-section-Animal")).not.toBeInTheDocument();
});
