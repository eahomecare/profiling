import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sleep } from "../utils/sleep";

const initialState = {
  status: "idle",
  keywords: [],
};

export const getKeywords = createAsyncThunk("keywords/getKeywords", async () => {
  const { data } = await axios.get("/keywords");
  return data;
});



export const keywordSlice = createSlice({
  name: "keyword",
  initialState,
  reducers: {
    
  },
  extraReducers: {
    [getKeywords.pending]: (state, action) => {
      state.status = "loading";
    },
    [getKeywords.fulfilled]: (state, action) => {
      state.status = "success";

    //   const curr_state_obj = {}
    //   const res_obj = {}
    //   state.keywords.map(e => curr_state_obj[e.id] = e)
    //   action.payload.customer_details.map(e => res_obj[e.id] = e)
    //   state.keywords = Object.values(Object.assign(curr_state_obj,res_obj)) ;
    },
    [getKeywords.rejected]: (state, action) => {
      state.status = "failed";
    }
  },
});

export default keywordSlice.reducer;
export const { setCurrentCustomer } = keywordSlice.actions;
