import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk("campaign/fetchData", async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/campaign/reports/all`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
});

const initialState = {
  data: [],
  campaignNames: [],
  selectedCampaigns: [],
  status: "idle",
  error: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    selectCampaign: (state, action) => {
      state.selectedCampaigns = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.campaignNames = action.payload.map((item) => item.campaignName);
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { selectCampaign } = campaignSlice.actions;

export default campaignSlice.reducer;
