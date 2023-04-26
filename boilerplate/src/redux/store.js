import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import customerSlice from "./customerSlice";
import keywordSlice from "./keywordSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customer:customerSlice,
    keyword:keywordSlice
  },
});
