import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk("campaign/fetchData", async () => {
  const response = {
    data: [],
  };
  return response.data;
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
  data: [
    {
      name: "Campaign Name 1",
      delivered: 4000,
      interested: 3000,
      converted: 2000,
      failure: 100,
      success: 1000,
    },
    {
      name: "Campaign Name 2",
      delivered: 9000,
      interested: 6500,
      converted: 4500,
      failure: 300,
      success: 900,
    },
    {
      name: "Campaign Name 3",
      delivered: 5000,
      interested: 3700,
      converted: 2500,
      failure: 150,
      success: 1100,
    },
    {
      name: "Campaign Name 4",
      delivered: 5500,
      interested: 4000,
      converted: 2700,
      failure: 180,
      success: 900,
    },
    {
      name: "Campaign Name 5",
      delivered: 4800,
      interested: 3400,
      converted: 2300,
      failure: 120,
      success: 1000,
    },
    {
      name: "Campaign Name 6",
      delivered: 4700,
      interested: 3300,
      converted: 2200,
      failure: 110,
      success: 1300,
    },
    {
      name: "Campaign Name 7",
      delivered: 4600,
      interested: 3200,
      converted: 2100,
      failure: 100,
      success: 1400,
    },
  ],
  sources: ["Homecare", "Cyberior", "EZ-Auto", "EZ-Travel", "E-Portal 2.0"],
  campaignNames: ["Campaign 1", "Campaign 2", "Campaign 3"],
  status: "idle",
  error: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload && action.payload.length > 0) {
          state.data = action.payload;
        }
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

export default campaignSlice.reducer;
