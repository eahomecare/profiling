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

export const fetchMenuItems = createAsyncThunk(
  "widget2/fetchMenuItems",
  async () => {
    const response = await axios.get("/widget2/getMenuItems");
    const data = response.data;

    // Transforming data to match the Select component requirement
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

export const fetchDistribution = createAsyncThunk(
  "widget2/fetchDistribution",
  async (params) => {
    const response = await axios.post("/widget2/getDistribution", params);
    return response.data;
  },
);

export const widget2Slice = createSlice({
  name: "widget2",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.menuItems.fetchStatus = "loading";
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.menuItems.fetchStatus = "succeeded";
        state.menuItems.sources = action.payload.sources;
        state.menuItems.years = action.payload.years;
        state.menuItems.months = action.payload.months;
      })
      .addCase(fetchMenuItems.rejected, (state) => {
        state.menuItems.fetchStatus = "failed";
      })
      .addCase(fetchDistribution.pending, (state) => {
        state.distribution.fetchStatus = "loading";
      })
      .addCase(fetchDistribution.fulfilled, (state, action) => {
        state.distribution.fetchStatus = "succeeded";
        state.distribution.data = action.payload;
      })
      .addCase(fetchDistribution.rejected, (state) => {
        state.distribution.fetchStatus = "failed";
      });
  },
});

export default widget2Slice.reducer;
