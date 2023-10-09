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

export const fetchSources = createAsyncThunk(
  "campaign/fetchSources",
  async () => {
    const response = {
      sources: [],
    };
    return response.sources;
  },
);

export const fetchCampaignNames = createAsyncThunk(
  "campaign/fetchCampaignNames",
  async () => {
    const response = {
      campaignNames: [],
    };
    return response.campaignNames;
  },
);

const initialState = {
  data: [],
  sources: ["Homecare", "Cyberior", "EZ-Auto", "EZ-Travel", "E-Portal 2.0"],
  campaignNames: ["Campaign 1", "Campaign 2", "Campaign 3"],
  selectedCampaign: "All",
  status: "idle",
  error: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    selectCampaign: (state, action) => {
      state.selectedCampaign = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.map((item) => ({
          name: item.campaignName,
          delivered: item.totalSent,
          interested: item.success,
          failure: item.failed,
          converted: 0,
        }));
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.sources = action.payload;
        }
      })
      .addCase(fetchCampaignNames.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.campaignNames = action.payload;
        }
      });
  },
});

export const { selectCampaign } = campaignSlice.actions;

export default campaignSlice.reducer;
