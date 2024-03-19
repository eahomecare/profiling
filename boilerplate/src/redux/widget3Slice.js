import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  menuItems: {
    sources: [],
    years: [],
    months: [],
    fetchStatus: "idle",
  },
  distribution: {
    data: [],
    fetchStatus: "idle",
  },
};

export const fetchWidget3MenuItems = createAsyncThunk(
  "widget3/fetchMenuItems",
  async () => {
    const response = await axios.get("/widget3/getMenuItems");
    const data = response.data;

    const sources = data.sources.map((source) => ({
      value: source,
      label: source,
    }));
    const years = [
      { value: "All", label: "All" },
      ...data.years.map((year) => ({ value: year, label: year.toString() })),
    ];
    const months = [
      { value: "All", label: "All" },
      ...data.months.map((month) => ({ value: month, label: month })),
    ];

    return { sources, years, months };
  },
);

export const fetchWidget3Distribution = createAsyncThunk(
  "widget3/fetchDistribution",
  async (params) => {
    const response = await axios.post("/widget3/getDistribution", params);
    return response.data;
  },
);

export const widget3Slice = createSlice({
  name: "widget3",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWidget3MenuItems.pending, (state) => {
        state.menuItems.fetchStatus = "loading";
      })
      .addCase(fetchWidget3MenuItems.fulfilled, (state, action) => {
        state.menuItems.fetchStatus = "succeeded";
        state.menuItems.sources = action.payload.sources;
        state.menuItems.years = action.payload.years;
        state.menuItems.months = action.payload.months;
      })
      .addCase(fetchWidget3MenuItems.rejected, (state) => {
        state.menuItems.fetchStatus = "failed";
      })
      .addCase(fetchWidget3Distribution.pending, (state) => {
        state.distribution.fetchStatus = "loading";
      })
      .addCase(fetchWidget3Distribution.fulfilled, (state, action) => {
        state.distribution.fetchStatus = "succeeded";
        state.distribution.data = action.payload;
      })
      .addCase(fetchWidget3Distribution.rejected, (state) => {
        state.distribution.fetchStatus = "failed";
      });
  },
});

export default widget3Slice.reducer;
