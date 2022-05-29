import { render } from "testUtils";
import { CatalogToc } from "../Catalog.Toc";

const setup = (config: Record<string, DatasetEntry> | undefined = {}) => {
  const utils = render(<CatalogToc collectionConfig={config} />);
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
  const config: Record<string, DatasetEntry> = {
    red: { category: "color" },
    blue: { category: "color" },
    one: { category: "number" },
    two: { category: "number" },
  };

  const { getByLabelText, getByText } = setup(config);
  const nav = getByLabelText("Dataset category navigation");
  expect(nav).toBeInTheDocument();
  expect(getByText("color")).toBeInTheDocument();
  expect(getByText("number")).toBeInTheDocument();
  expect(getByText("Featured")).toBeInTheDocument();
});
