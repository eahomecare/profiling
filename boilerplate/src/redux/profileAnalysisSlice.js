import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_ENDPOINT = `${process.env.REACT_APP_API_URL}/customers/count/monthly`;

// Async action for fetching customer profile data
export const fetchProfileCount = createAsyncThunk(
  "profileCount/fetchProfileCount",
  async (source) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/customers/count/monthly/${source}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch customer data");
    }

    const data = await response.json();

    console.log("month api", data);

    return data.map((item) => ({
      name: item.month,
      // customers: item.count,
      // profiles: 0,
      // Temporary change
      customers: 0,
      profiles: item.count,
    }));
  },
);

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

const profileCountSlice = createSlice({
  name: "profileCount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileCount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfileCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default profileCountSlice.reducer;
