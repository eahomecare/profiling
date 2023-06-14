import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sleep } from "../utils/sleep";

const initialState = {
  status: "idle",
  customers: [],
  customerDetails: {},
  fetchedPofileCompleteness:false
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
      state.status = "loading";
    },
    [getCustomerDetails.fulfilled]: (state, action) => {
      state.status = "success";
      state.customerDetails = action.payload.response.customer;
    },
    [getCustomerDetails.rejected]: (state, action) => {
      state.status = "failed";
    },
    [getCustomersProfileCompleteness.pending]: (state, action) => {
      state.status = "loading";
    },
    [getCustomersProfileCompleteness.fulfilled]: (state, action) => {
      state.status = "success";
      const copyCustomers = [...state.customers]
      copyCustomers.map((e,index)=>{
        copyCustomers[index]['profile_completion'] = action.payload.profileCompletion[e.id]?action.payload.profileCompletion[e.id]:0
      })

      state.fetchedPofileCompleteness = true

      
    },
    [getCustomersProfileCompleteness.rejected]: (state, action) => {
      state.status = "failed";
    }
  },
});

export default customerSlice.reducer;
export const { setCurrentCustomer } = customerSlice.actions;
