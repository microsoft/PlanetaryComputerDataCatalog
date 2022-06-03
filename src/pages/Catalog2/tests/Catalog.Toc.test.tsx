import { render } from "testUtils";
import { CatalogToc } from "../Catalog.Toc";

const setup = (
  collectionConfig: Record<string, DatasetEntry> | undefined = {},
  storageCollectionConfig: Record<string, StorageDatasetEntry> | undefined = {}
) => {
  const utils = render(
    <CatalogToc />,
    {},
    { collectionConfig, storageCollectionConfig, groupConfig: {}, featuredIds: [] }
  );
  return {
    ...utils,
  };
};

test("Catalog TOC renders featured", () => {
  const { getByText, getByLabelText } = setup();
  expect(getByLabelText("Dataset category navigation")).toBeInTheDocument();

  expect(getByText("Featured")).toBeInTheDocument();
});

test("Catalog TOC renders all categories", () => {
  const collectionConfig: Record<string, DatasetEntry> = {
    red: { category: "color" },
    blue: { category: "color" },
    one: { category: "number" },
    two: { category: "number" },
  };
  const nonApiCollectionConfig: Record<string, StorageDatasetEntry> = {
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
    nonApiCollectionConfig
  );
  const nav = getByLabelText("Dataset category navigation");
  expect(nav).toBeInTheDocument();
  expect(getByText("color")).toBeInTheDocument();
  expect(getByText("number")).toBeInTheDocument();
  expect(getByText("Featured")).toBeInTheDocument();
  expect(getByText("animal")).toBeInTheDocument();
});

test("Catalog TOC doesn't render categories of hidden datasets", () => {
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
