import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sleep } from "../utils/sleep";

const initialState = {
  KeywordsStatus: "idle",
  customerKeywordsStatus: "idle",
  updateKeywordsStatus:"idle",
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

export const updateKeywords = createAsyncThunk(
  "keywords/searchKeywords",
  async (keywordPayload) => {
    const { data } = await axios.post("/keywords/update/many", keywordPayload);
    return data;
  }
);

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
      state.keywordsStatus = "loading";
    },
    [getKeywords.fulfilled]: (state, action) => {
      state.keywordsStatus = "success";

      const curr_state_obj = {}
      const res_obj = {}
      state.keywords.map(e => curr_state_obj[e.id] = e)
      action.payload.data.map(e => res_obj[e.id] = e)
      state.keywords = Object.values(Object.assign(curr_state_obj,res_obj)) ;
    },
    [getKeywords.rejected]: (state, action) => {
      state.keywordsStatus = "failed";
    },
    [getCustomerKeywords.pending]: (state, action) => {
      state.customerKeywordsStatus = "loading";
    },
    [getCustomerKeywords.fulfilled]: (state, action) => {
      state.customerKeywordsStatus = "success";
      state.customerKeywords = action.payload.data
    },
    [getCustomerKeywords.rejected]: (state, action) => {
      state.customerKeywordsStatus = "failed";
    },
    [searchKeywords.pending]: (state, action) => {
      state.keywordsStatus = "loading";
    },
    [searchKeywords.fulfilled]: (state, action) => {
      // state.keywordsStatus = "success";

    },
    [searchKeywords.rejected]: (state, action) => {
      state.keywordsStatus = "failed";
    },
    [updateKeywords.pending]: (state, action) => {
      state.updateKeywordsStatus = "loading";
    },
    [updateKeywords.fulfilled]: (state, action) => {
      state.updateKeywordsStatus = "success";
    },
    [updateKeywords.rejected]: (state, action) => {
      state.updateKeywordsStatus = "failed";
    }
  },
});

export default keywordSlice.reducer;
