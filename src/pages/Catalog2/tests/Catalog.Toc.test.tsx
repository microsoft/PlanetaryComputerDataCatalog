import { render } from "testUtils";
import { CatalogToc } from "../Catalog.Toc";

const setup = (
  collectionConfig: Record<string, DatasetEntry> | undefined = {},
  nonApiCollectionConfig: Record<string, NonApiDatasetEntry> | undefined = {}
) => {
  const utils = render(
    <CatalogToc
      collectionConfig={collectionConfig}
      nonApiCollectionConfig={nonApiCollectionConfig}
    />
  );
  return {
    ...utils,
  };
};

test("Catalog table of contents renders featured", () => {
  const { getByText, getByLabelText } = setup();
  expect(getByLabelText("Dataset category navigation")).toBeInTheDocument();

  expect(getByText("Featured")).toBeInTheDocument();
});

test("Catalog table of contents renders all categories", () => {
  const collectionConfig: Record<string, DatasetEntry> = {
    red: { category: "color" },
    blue: { category: "color" },
    one: { category: "number" },
    two: { category: "number" },
  };
  const nonApiCollectionConfig: Record<string, NonApiDatasetEntry> = {
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
