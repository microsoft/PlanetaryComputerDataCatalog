import { configureStore } from "@reduxjs/toolkit";
import catalogSlice from "../features/catalog/catalogSlice";

export default configureStore({
  reducer: {
    catalog: catalogSlice,
  },
});
