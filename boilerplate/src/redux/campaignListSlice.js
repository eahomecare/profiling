import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  campaignStatus: "idle",
  campaigns: [],
  error: null,
};

export const fetchCampaigns = createAsyncThunk(
  "campaigns/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/campaign`,
      );
      console.log("Campaign List response data", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return rejectWithValue(
        error.response?.data || "Unable to fetch campaigns",
      );
    }
  },
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCampaigns.pending]: (state) => {
      state.campaignStatus = "loading";
      state.error = null; // Reset the error state
    },
    [fetchCampaigns.fulfilled]: (state, action) => {
      console.log("Received campaigns:", action.payload);
      state.campaignStatus = "success";
      state.campaigns = action.payload.map((campaign) => ({
        ...campaign,
        status: determineCampaignStatus(campaign),
      }));
      console.log("Final campaigns for table:", action.payload);
    },
    [fetchCampaigns.rejected]: (state, action) => {
      state.campaignStatus = "failed";
      state.error = action.payload;
    },
  },
});

function determineCampaignStatus(campaign) {
  const currentDate = new Date();
  const startDate = new Date(campaign.start);
  const endDate = new Date(campaign.end);

  if (endDate < currentDate) return "Closed";
  if (startDate > currentDate) return "Pending";
  if (currentDate >= startDate && currentDate <= endDate)
    return campaign.isActive ? "On-going" : "Cancelled";
  return "Unknown";
}

export default campaignSlice.reducer;
