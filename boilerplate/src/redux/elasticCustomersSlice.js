import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state
const initialState = {
  customers: [],
  loading: false,
  error: null,
  pagination: { from: 0, size: 10 }, // Default pagination settings
  searchQuery: "", // Tracks the global search query
  columnSearchQuery: {}, // Tracks the column-specific search queries
};

console.log(
  "Initializing elasticCustomersSlice with initialState:",
  initialState,
);

// Async thunk for fetching paginated results
export const fetchPaginatedResults = createAsyncThunk(
  "elasticCustomers/fetchPaginatedResults",
  async ({ from = 0, size = 10 }, { rejectWithValue }) => {
    console.log(`Fetching paginated results: from=${from}, size=${size}`);
    try {
      const response = await axios.get(
        "/customers/elastic/fetch-paginated-results",
        { params: { from, size } },
      );
      console.log("Fetched paginated results successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching paginated results:", error.message);
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk for global search
export const performGlobalSearch = createAsyncThunk(
  "elasticCustomers/performGlobalSearch",
  async ({ searchTerm, from, size }, { rejectWithValue }) => {
    console.log(
      `Performing global search: searchTerm=${searchTerm}, from=${from}, size=${size}`,
    );
    try {
      const response = await axios.get("/customers/elastic/global-search", {
        params: { searchTerm, from, size },
      });
      console.log("Global search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in global search:", error.message);
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk for compound search
export const performCompoundSearch = createAsyncThunk(
  "elasticCustomers/performCompoundSearch",
  async ({ searchTerms, from, size }, { rejectWithValue }) => {
    console.log(
      `Performing compound search: searchTerms=${JSON.stringify(
        searchTerms,
      )}, from=${from}, size=${size}`,
    );
    try {
      const response = await axios.get("/customers/elastic/compound-search", {
        params: { ...searchTerms, from, size },
      });
      console.log("Compound search results:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in compound search:", error.message);
      return rejectWithValue(error.response.data);
    }
  },
);

// Slice definition
const elasticCustomerSlice = createSlice({
  name: "elasticCustomers",
  initialState,
  reducers: {
    resetSearch: (state) => {
      console.log("Resetting search queries");
      state.searchQuery = "";
      state.columnSearchQuery = {};
    },
    loadingStateElasticCustomers: (state) => {
      console.log("load state for elastic customer true");
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaginatedResults.pending, (state) => {
        console.log("Fetching paginated results pending");
        state.loading = true;
      })
      .addCase(fetchPaginatedResults.fulfilled, (state, action) => {
        console.log("Fetching paginated results fulfilled");
        state.customers = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPaginatedResults.rejected, (state, action) => {
        console.log("Fetching paginated results rejected", action.payload);
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(performGlobalSearch.fulfilled, (state, action) => {
        console.log("Global search fulfilled");
        state.customers = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(performCompoundSearch.fulfilled, (state, action) => {
        console.log("Compound search fulfilled");
        state.customers = action.payload;
        state.loading = false;
        state.error = null;
      });
  },
});

// Export actions and reducer
export const { resetSearch, loadingStateElasticCustomers } =
  elasticCustomerSlice.actions;
export default elasticCustomerSlice.reducer;

// Selectors
export const selectCustomers = (state) => {
  console.log("Selecting customers");
  return state.elasticCustomers.customers;
};
export const isLoading = (state) => {
  console.log("Checking if loading");
  return state.elasticCustomers.loading;
};
export const selectPagination = (state) => {
  console.log("Selecting pagination");
  return state.elasticCustomers.pagination;
};

// Example selector using createSelector for memoization
export const selectFilteredCustomers = createSelector(
  [selectCustomers, (state, filter) => filter],
  (customers, filter) => {
    console.log(`Filtering customers with filter: ${filter}`);
    return customers.filter((customer) => customer.name.includes(filter));
  },
);
