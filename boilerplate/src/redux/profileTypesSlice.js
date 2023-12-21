import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  profileTypes: [],
  profileMappings: [],
  status: "idle",
  profileTypesStatus: "idle",
  profileMappingsStatus: "idle",
  error: null,
};

// Async thunk for fetching customer data
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

// Async thunk for fetching profile types
export const fetchProfileTypes = createAsyncThunk(
  "profiling/fetchProfileTypes",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile-types`,
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
);

// Async thunk for fetching profile mappings by profile ID
export const fetchProfileMappings = createAsyncThunk(
  "profiling/fetchProfileMappings",
  async (profileId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile-type-customer-mapping/profile-customer-mappings-by-profile/${profileId}`,
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
      })
      .addCase(fetchProfileTypes.pending, (state) => {
        state.profileTypesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProfileTypes.fulfilled, (state, action) => {
        state.profileTypesStatus = "succeeded";
        state.profileTypes = action.payload;
      })
      .addCase(fetchProfileTypes.rejected, (state, action) => {
        state.profileTypesStatus = "failed";
        state.error =
          action.error.message || "Failed to fetch profile types";
      })
      .addCase(fetchProfileMappings.pending, (state) => {
        state.profileMappingsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProfileMappings.fulfilled, (state, action) => {
        state.profileMappingsStatus = "succeeded";
        state.profileMappings = []
        state.profileMappings = action.payload;
      })
      .addCase(fetchProfileMappings.rejected, (state, action) => {
        state.profileMappingsStatus = "failed";
        state.error =
          action.error.message || "Failed to fetch profile mappings";
      });
  },
});

export default profilingSlice.reducer;
