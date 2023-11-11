import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const fetchData = createAsyncThunk(
  "profiling/fetchData",
  async (customerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile-type-customer-mapping/customer-mapping/${customerId}`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
);

const profilingSlice = createSlice({
  name: "profiling",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Failed to fetch profile types for the customer";
      });
  },
});

export default profilingSlice.reducer;
