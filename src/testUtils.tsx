import { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@fluentui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import {
  DataConfigContextProps,
  DataConfigProvider,
} from "components/state/DataConfigProvider";
axios.defaults.adapter = require("axios/lib/adapters/http");
export const axiosForMock = axios;

const makeWrapper = (dataConfig: DataConfigContextProps) => {
  const AllTheProviders: FC = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <DataConfigProvider {...dataConfig}>
            <MemoryRouter>
              <Routes>
                <Route path="/" element={children} />
              </Routes>
            </MemoryRouter>
          </DataConfigProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  };
  return AllTheProviders;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
  dataConfig: DataConfigContextProps = {
    collectionConfig: defaultCollectionsConfig,
    storageCollectionConfig: defaultStorageConfig,
    groupConfig: {},
    featuredIds: defaultFeaturedIds,
  }
) => {
  const wrapper = makeWrapper(dataConfig);
  return render(ui, { wrapper, ...options });
};

export * from "@testing-library/react";
export { customRender as render };

export const defaultCollectionsConfig: Record<string, DatasetEntry> = {
  red: { category: "Color" },
  blue: { category: "Color" },
  one: { category: "Number" },
  two: { category: "Number" },
  "two-a": { category: "Number" },
};

export const defaultStorageConfig: Record<string, StorageDatasetEntry> = {
  panda: {
    category: "Animal",
    title: "Non-API Panda",
    short_description: "Non-API 1 Panda description",
    keywords: ["animal"],
    infoUrl: "https://example.com/non-api-1",
    thumbnailUrl: "https://example.com/non-api-1.png",
  },
};

export const defaultCollectionsResponse = {
  collections: [
    { id: "red", title: "This is Red", keywords: ["red"] },
    { id: "blue", title: "This is Blue", keywords: ["blue"] },
    { id: "one", title: "This is One", keywords: ["Uno"] },
    { id: "two", title: "This is Two", keywords: ["Dos"] },
    { id: "two-a", title: "This is Two-A", keywords: ["Dos"] },
  ],
};

export const defaultFeaturedIds = ["two-a"];
