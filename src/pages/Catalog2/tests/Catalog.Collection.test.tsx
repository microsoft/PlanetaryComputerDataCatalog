import { within } from "@testing-library/react";

import { defaultCollectionsResponse, render } from "testUtils";
import { IPcCollection } from "types/stac";
import { CatalogCollection } from "../Catalog.Collection";

const setup = (asButton: boolean = false) => {
  const collection: IPcCollection = {
    ...defaultCollectionsResponse.collections[0],
    description: "This is a description",
    "msft:short_description": "This is a short description",
    assets: { thumbnail: { href: "https://example.com/color.png" } },
  };

  const utils = render(
    <CatalogCollection collection={collection} asButton={asButton} />,
    {}
  );
  return {
    ...utils,
  };
};

test("Catalog collection renders full item with links", () => {
  const { queryByTestId, getByTestId } = setup();

  const item = getByTestId("catalog-collection-item");
  const subItem = within(item);

  expect(queryByTestId("collection-as-button")).not.toBeInTheDocument();
  expect(item).toBeInTheDocument();
  expect(subItem.getByTestId("catalog-collection-thumb")).toBeInTheDocument();
  expect(subItem.getByTestId("catalog-collection-thumb-link")).toBeInTheDocument();
  expect(subItem.getByText("This is a short description")).toBeInTheDocument();
  expect(subItem.getByText("This is Red")).toBeInTheDocument();
  expect(subItem.getByTestId("collection-keywords-bar")).toBeInTheDocument();
});

test("Catalog collection renders full item without links as button", () => {
  const { queryByTestId, getByTestId } = setup(true);

  const item = getByTestId("catalog-collection-item");
  const subItem = within(item);

  expect(queryByTestId("collection-as-button")).toBeInTheDocument();
  expect(item).toBeInTheDocument();
  expect(subItem.getByTestId("catalog-collection-thumb")).toBeInTheDocument();
  expect(
    subItem.queryByTestId("catalog-collection-thumb-link")
  ).not.toBeInTheDocument();
  expect(subItem.getByText("This is a short description")).toBeInTheDocument();
  expect(subItem.getByText("This is Red")).toBeInTheDocument();
  expect(subItem.queryByTestId("collection-keywords-bar")).not.toBeInTheDocument();
});
