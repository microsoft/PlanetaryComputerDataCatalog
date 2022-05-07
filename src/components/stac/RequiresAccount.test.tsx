// import { render } from "testUtils";

import { render } from "@testing-library/react";
import { IStacCollection } from "types/stac";
import { CollectionProvider } from "./CollectionContext";
import RequiresAccount from "./RequiresAccount";

const getAcctReqCollection = (required: boolean): IStacCollection => {
  return {
    id: "test",
    title: "Test",
    description: "Test",
    license: "",
    item_assets: {},
    keywords: [],
    assets: {},
    extent: { spatial: { bbox: [] }, temporal: { interval: [] } },
    links: [],
    "msft:short_description": "",
    "msft:requires_account": required,
  };
};

test("it shows message when msft:requires_account is true", async () => {
  const collection = getAcctReqCollection(true);
  const { getByTestId } = render(
    <CollectionProvider collection={collection}>
      <RequiresAccount />
    </CollectionProvider>
  );

  expect(getByTestId("msft-acct-req-msg")).toBeInTheDocument();
});

test("it doest not show message when msft:requires_account is false", () => {
  const collection = getAcctReqCollection(false);
  const { queryByTestId } = render(
    <CollectionProvider collection={collection}>
      <RequiresAccount />
    </CollectionProvider>
  );

  expect(queryByTestId("msft-acct-req-msg")).toBeNull();
});
