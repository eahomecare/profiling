import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sleep } from "../utils/sleep";

const initialState = {
  status: "idle",
  customers: [],
  customerDetails: {},
  customerServiceHistory:[],
  fetchedPofileCompleteness:false,
  customerServiceHistoryStatus:"idle",
  customerDetailsStatus:"idle"
};

export const getCustomers = createAsyncThunk("customer/getCustomers", async () => {
  // await sleep(3000)
  const { data } = await axios.get("/customers");
  return data;
});


export const getCustomersProfileCompleteness = createAsyncThunk("customer/getCustomersProfileCompleteness", async () => {
  await sleep(200)
  const { data } = await axios.get("/profile");
  return data;
});

export const getCustomerDetails = createAsyncThunk(
  "customer/getCustomerDetails",
  async (id) => {
    const { data } = await axios.get("/customers/" + id);
    return data;
  }
);


export const getCustomerServicesHistory = createAsyncThunk(
  "customer/getCustomerDetails",
  async (id) => {
    const { data } = await axios.get("/api/service-customer-mappings/" + id);
    console.log(data);
    return data;
  }
);



export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCurrentCustomer:(state,action) => {
      console.log(action.payload);
      state.customerDetails = action.payload
    }
  },
  extraReducers: {
    [getCustomers.pending]: (state, action) => {
      state.status = "loading";
    },
    [getCustomers.fulfilled]: (state, action) => {
      state.status = "success";

      const curr_state_obj = {}
      const res_obj = {}
      state.customers.map(e => curr_state_obj[e.id] = e)
      action.payload.customer_details.map(e => res_obj[e.id] = e)
      state.customers = Object.values(Object.assign(curr_state_obj,res_obj)) ;
    },
    [getCustomers.rejected]: (state, action) => {
      state.status = "failed";
    },

    [getCustomerDetails.pending]: (state, action) => {
      state.customerDetailsStatus = "loading";
    },
    [getCustomerDetails.fulfilled]: (state, action) => {
      state.customerDetailsStatus = "success";
      state.customerDetails = action.payload.response.customer;
    },
    [getCustomerDetails.rejected]: (state, action) => {
      state.customerDetailsStatus = "failed";
    },
    [getCustomersProfileCompleteness.pending]: (state, action) => {
      state.status = "loading";
    },
   [getCustomersProfileCompleteness.fulfilled]: (state, action) => {
      state.status = "success";

      const updatedCustomers = state.customers.map((customer) => {
        const profileCompletion = action.payload.profileCompletion ? action.payload.profileCompletion[customer.id] : 0;
        return {
          ...customer,
          profile_completion: profileCompletion,
        };
      });

      return {
        ...state,
        customers: updatedCustomers,
        fetchedPofileCompleteness: true,
      };
    },

    [getCustomersProfileCompleteness.rejected]: (state, action) => {
      state.status = "failed";
    },
    [getCustomerServicesHistory.pending]: (state, action) => {
      state.customerServiceHistoryStatus = "loading";
    },
    [getCustomerServicesHistory.fulfilled]: (state, action) => {
      state.customerServiceHistoryStatus = "success";
      state.customerServiceHistory = action.payload.data;
    },
    [getCustomerServicesHistory.rejected]: (state, action) => {
      state.customerServiceHistoryStatus = "failed";
    },
  },
});

export default customerSlice.reducer;
export const { setCurrentCustomer } = customerSlice.actions;
