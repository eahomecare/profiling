import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sleep } from "../utils/sleep";

const initialState = {
  status: "idle",
  customers: [],
  customerDetails: {}
};

export const getCustomers = createAsyncThunk("customer/getCustomers", async () => {
  await sleep(3000)
  const { data } = await axios.get("/customers");
  return data;
});

export const getCustomerDetails = createAsyncThunk(
  "customer/getCustomerDetails",
  async (id) => {
    const { data } = await axios.get("/customers/" + id);
    console.log(data);
    return data;
  }
);


export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: {
    [getCustomers.pending]: (state, action) => {
      state.status = "loading";
    },
    [getCustomers.fulfilled]: (state, action) => {
      state.status = "success";

      const curr_state_obj = {}
      const res_obj = {}
      state.customers.map(e => curr_state_obj[e._id] = e)
      action.payload.response.customers.map(e => res_obj[e._id] = e)
      state.customers = Object.values(Object.assign(curr_state_obj,res_obj)) ;
    },
    [getCustomers.rejected]: (state, action) => {
      state.status = "failed";
    },

    [getCustomerDetails.pending]: (state, action) => {
      state.status = "loading";
    },
    [getCustomerDetails.fulfilled]: (state, action) => {
      state.status = "success";
      state.customerDetails = action.payload.response.customer;
    },
    [getCustomerDetails.rejected]: (state, action) => {
      state.status = "failed";
    }
  },
});

export default customerSlice.reducer;
