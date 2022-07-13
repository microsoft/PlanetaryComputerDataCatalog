import nock from "nock";
import { defaultCollectionsResponse, render, waitFor } from "testUtils";
import { IStacCollection } from "types/stac";
import { STAC_URL } from "utils/constants";
import { CatalogToc } from "../Catalog.Toc";

const setup = (
  collectionConfig: Record<string, DatasetEntry> | undefined = {},
  storageCollectionConfig: Record<string, StorageDatasetEntry> | undefined = {},
  includeStorageDatasets: boolean = true,
  preFilterCollectionFn: (collection: IStacCollection) => boolean = () => true
) => {
  const apiUrl = new URL(STAC_URL as string);
  const httpScope = nock(apiUrl.origin)
    .get(`${apiUrl.pathname}/collections`)
    .reply(200, defaultCollectionsResponse);

  const utils = render(
    <CatalogToc
      includeStorageDatasets={includeStorageDatasets}
      preFilterCollectionFn={preFilterCollectionFn}
    />,
    {},
    { collectionConfig, storageCollectionConfig, groupConfig: {}, featuredIds: [] }
  );

  return {
    httpScope,
    ...utils,
  };
};

test("Catalog TOC renders featured", () => {
  const { getByText, getByLabelText } = setup();
  expect(getByLabelText("Dataset category navigation")).toBeInTheDocument();

  expect(getByText("Featured")).toBeInTheDocument();
});

test("Catalog TOC renders all categories", async () => {
  const collectionConfig: Record<string, DatasetEntry> = {
    red: { category: "color" },
    blue: { category: "color" },
    one: { category: "number" },
    two: { category: "number" },
  };
  const storageCollectionConfig: Record<string, StorageDatasetEntry> = {
    cat: {
      category: "animal",
      title: "Cat",
      keywords: ["cat"],
      infoUrl: "",
      thumbnailUrl: "",
      short_description: "",
    },
  };

  const { getByLabelText, getByText } = setup(
    collectionConfig,
    storageCollectionConfig
  );
  const nav = getByLabelText("Dataset category navigation");
  expect(nav).toBeInTheDocument();
  expect(getByText("color")).toBeInTheDocument();
  expect(getByText("number")).toBeInTheDocument();
  expect(getByText("Featured")).toBeInTheDocument();
  expect(getByText("animal")).toBeInTheDocument();
});

test("Catalog TOC doesn't render categories of hidden datasets", async () => {
  const collectionConfig: Record<string, DatasetEntry> = {
    red: { category: "Category A" },
    blue: { category: "Category B" },
    one: { category: "Category C", isHidden: true },
  };

  const { getByLabelText, getByText, queryByText } = setup(collectionConfig);
  const nav = getByLabelText("Dataset category navigation");
  expect(nav).toBeInTheDocument();
  expect(getByText("Category A")).toBeInTheDocument();
  expect(getByText("Category B")).toBeInTheDocument();
  expect(queryByText("Category C")).not.toBeInTheDocument();
});

test("Catalog TOC doesn't render categories of filtered-out datasets", async () => {
  const collectionConfig: Record<string, DatasetEntry> = {
    red: { category: "Color" },
    blue: { category: "Color" },
    one: { category: "Number" },
    two: { category: "Number" },
  };

  const onlyColorsFn = (collection: IStacCollection) =>
    ["red", "blue"].includes(collection.id);

  const { httpScope, getByLabelText, getByText, queryByText } = setup(
    collectionConfig,
    {},
    true,
    onlyColorsFn
  );

  const nav = getByLabelText("Dataset category navigation");
  expect(nav).toBeInTheDocument();
  expect(getByText("Color")).toBeInTheDocument();

  // After the collections load, the filtered out collection's category should not be present
  await waitFor(() => expect(queryByText("Number")).not.toBeInTheDocument(), {
    timeout: 5000,
  });

  httpScope.done();
});

test("Catalog TOC doesn't render storage categories when they are not enabled", async () => {
  const collectionConfig: Record<string, DatasetEntry> = {
    red: { category: "color" },
    blue: { category: "color" },
    one: { category: "number" },
    two: { category: "number" },
  };

  const storageCollectionConfig: Record<string, StorageDatasetEntry> = {
    cat: {
      category: "animal",
      title: "Cat",
      keywords: ["cat"],
      infoUrl: "",
      thumbnailUrl: "",
      short_description: "",
    },
  };
  const { getByLabelText, getByText, queryByText } = setup(
    collectionConfig,
    storageCollectionConfig,
    false
  );
  const nav = getByLabelText("Dataset category navigation");
  expect(nav).toBeInTheDocument();
  expect(getByText("color")).toBeInTheDocument();
  expect(getByText("number")).toBeInTheDocument();
  expect(queryByText("animal")).not.toBeInTheDocument();
});
