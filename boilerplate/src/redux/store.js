import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import customerSlice from "./customerSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customer:customerSlice
  },
});
