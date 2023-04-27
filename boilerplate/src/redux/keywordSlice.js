import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sleep } from "../utils/sleep";

const initialState = {
  status: "idle",
  keywords: [],
  customerKeywords:[]
};

export const getKeywords = createAsyncThunk("keywords/getKeywords", async () => {
  const { data } = await axios.get("/keywords");
  return data;
});

export const getCustomerKeywords = createAsyncThunk("keywords/getCustomerKeywords", async (id) => {
  const { data } = await axios.get("/keywords/customer/"+id);
  return data;
});


export const searchKeywords = createAsyncThunk("keywords/searchKeywords", async (query) => {
  const { data } = await axios.get("/keywords/search/"+query);
  return data;
});


export const keywordSlice = createSlice({
  name: "keyword",
  initialState,
  reducers: {
    updateKeywords:(state,action) => {
      console.log(action.payload);
      state.customerDetails = action.payload
    }
    
  },
  extraReducers: {
    [getKeywords.pending]: (state, action) => {
      state.status = "loading";
    },
    [getKeywords.fulfilled]: (state, action) => {
      state.status = "success";

      const curr_state_obj = {}
      const res_obj = {}
      state.keywords.map(e => curr_state_obj[e.id] = e)
      action.payload.data.map(e => res_obj[e.id] = e)
      state.keywords = Object.values(Object.assign(curr_state_obj,res_obj)) ;
    },
    [getKeywords.rejected]: (state, action) => {
      state.status = "failed";
    },
    [getCustomerKeywords.pending]: (state, action) => {
      state.status = "loading";
    },
    [getCustomerKeywords.fulfilled]: (state, action) => {
      state.status = "success";
      state.customerKeywords = action.payload.data
    },
    [getCustomerKeywords.rejected]: (state, action) => {
      state.status = "failed";
    },
    [searchKeywords.pending]: (state, action) => {
      state.status = "loading";
    },
    [searchKeywords.fulfilled]: (state, action) => {
      // state.status = "success";

    },
    [searchKeywords.rejected]: (state, action) => {
      state.status = "failed";
    }
  },
});

export default keywordSlice.reducer;
