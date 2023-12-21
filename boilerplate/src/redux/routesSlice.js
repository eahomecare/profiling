// routesSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPathname: "/",
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setPathname: (state, action) => {
      state.currentPathname = action.payload;
    },
  },
});

export const { setPathname } = routesSlice.actions;

export const selectPathname = (state) => state.routes.currentPathname;

export default routesSlice.reducer;
