import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sleep } from "../utils/sleep";

const initialState = {
  status: "idle",
  customers: [],
  customerDetails: {},
  customerProfileCompletion: null,
  customerServiceHistory: [],
  fetchedPofileCompleteness: false,
  customerServiceHistoryStatus: "idle",
  customerDetailsStatus: "idle",
  customerRemarks: [], // New field for storing customer remarks
  remarksStatus: "idle", // New status field for customer remarks
};

export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async () => {
    // await sleep(3000)
    const { data } = await axios.get("/customers");
    return data;
  },
);

export const getCustomersProfileCompleteness = createAsyncThunk(
  "customer/getCustomersProfileCompleteness",
  async () => {
    await sleep(200);
    const { data } = await axios.get("/profile");
    return data;
  },
);

export const getCustomerDetails = createAsyncThunk(
  "customer/getCustomerDetails",
  async (id) => {
    const { data } = await axios.get("/customers/" + id);
    return data;
  },
);

export const getCustomerServicesHistory = createAsyncThunk(
  "customer/getCustomerServicesHistory",
  async (id) => {
    const { data } = await axios.get("/api/service-customer-mappings/" + id);
    console.log(data);
    return data;
  },
);

export const getCustomerRemarks = createAsyncThunk(
  "customer/getCustomerRemarks",
  async (customerId) => {
    const { data } = await axios.get("/customers/remarks/" + customerId);
    console.log("Remarks in thunk", data);
    return data;
  },
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCurrentCustomer: (state, action) => {
      state.customerDetails = action.payload;
    },
    setCurrentCustomerProfileCompletion: (state, action) => {
      state.customerProfileCompletion = action.payload;
    },
    clearCurrentCustomer: (state, action) => {
      state.customerDetails = []
      state.customerDetailsStatus = "idle"
    }
  },
  extraReducers: {
    [getCustomers.pending]: (state) => {
      state.status = "loading";
    },
    [getCustomers.fulfilled]: (state, action) => {
      state.status = "success";
      const curr_state_obj = {};
      const res_obj = {};
      state.customers.map((e) => (curr_state_obj[e.id] = e));
      action.payload.customer_details.map((e) => (res_obj[e.id] = e));
      state.customers = Object.values(Object.assign(curr_state_obj, res_obj));
    },
    [getCustomers.rejected]: (state) => {
      state.status = "failed";
    },
    [getCustomerDetails.pending]: (state) => {
      state.customerDetailsStatus = "loading";
    },
    [getCustomerDetails.fulfilled]: (state, action) => {
      state.customerDetailsStatus = "success";
      state.customerDetails = action.payload;
    },
    [getCustomerDetails.rejected]: (state) => {
      state.customerDetailsStatus = "failed";
    },
    [getCustomersProfileCompleteness.pending]: (state) => {
      state.status = "loading";
    },
    [getCustomersProfileCompleteness.fulfilled]: (state, action) => {
      state.status = "success";
      const updatedCustomers = state.customers.map((customer) => {
        const profileCompletion = action.payload.profileCompletion
          ? action.payload.profileCompletion[customer.id]
          : 0;
        return {
          ...customer,
          profile_completion: profileCompletion,
        };
      });
      state.customers = updatedCustomers;
      state.fetchedPofileCompleteness = true;
    },
    [getCustomersProfileCompleteness.rejected]: (state) => {
      state.status = "failed";
    },
    [getCustomerServicesHistory.pending]: (state) => {
      state.customerServiceHistoryStatus = "loading";
    },
    [getCustomerServicesHistory.fulfilled]: (state, action) => {
      state.customerServiceHistoryStatus = "success";
      state.customerServiceHistory = action.payload.data;
    },
    [getCustomerServicesHistory.rejected]: (state) => {
      state.customerServiceHistoryStatus = "failed";
    },
    [getCustomerRemarks.pending]: (state) => {
      state.remarksStatus = "loading";
    },
    [getCustomerRemarks.fulfilled]: (state, action) => {
      state.remarksStatus = "success";
      state.customerRemarks = action.payload; // Assuming API returns an array of remarks
    },
    [getCustomerRemarks.rejected]: (state) => {
      state.remarksStatus = "failed";
    },
  },
});

export default customerSlice.reducer;
export const { setCurrentCustomer, clearCurrentCustomer, setCurrentCustomerProfileCompletion } = customerSlice.actions;
