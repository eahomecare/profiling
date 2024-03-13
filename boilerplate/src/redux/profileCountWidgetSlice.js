import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching menu items
export const fetchMenuItems = createAsyncThunk(
  "profileCountWidget/fetchMenuItems",
  async () => {
    console.log("Fetching menu items...");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/profile-count-widget/menu-items`,
    );
    if (!response.ok) {
      console.error("Failed to fetch menu items");
      throw new Error("Failed to fetch menu items");
    }
    const data = await response.json();
    console.log("Menu items fetched:", data);
    return data;
  },
);

// Async thunk for fetching distribution based on selected options
export const fetchDistribution = createAsyncThunk(
  "profileCountWidget/fetchDistribution",
  async (selection, { rejectWithValue }) => {
    const { profileType, demographic } = selection;
    console.log("Fetching distribution for:", selection);

    // Replace 'All' with an empty string
    const adjustedProfileType = profileType === "All" ? "" : profileType;
    const adjustedDemographic = demographic === "all" ? "" : demographic;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/profile-count-widget/distribution`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileType: adjustedProfileType,
            demographic: adjustedDemographic,
          }),
        },
      );
      if (!response.ok) {
        console.error("Failed to fetch distribution");
        throw new Error("Failed to fetch distribution");
      }
      const data = await response.json();
      if (Object.keys(data).length === 0) {
        console.error("No available data");
        return rejectWithValue("No available data.");
      }
      console.log("Distribution fetched:", data);
      return data;
    } catch (error) {
      console.error("Error fetching distribution:", error.message);
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  menuItems: {
    profileTypeItems: [],
    demographicItems: [],
  },
  distribution: {},
  status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

const profileCountWidgetSlice = createSlice({
  name: "profileCountWidget",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchMenuItems
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "loading";
        console.log("Loading menu items...");
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menuItems.profileTypeItems = action.payload.firstMenuItems;
        state.menuItems.demographicItems = action.payload.secondMenuItems;
        console.log("Menu items loaded successfully");
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.error("Error loading menu items:", action.error.message);
      })
      // Handle fetchDistribution
      .addCase(fetchDistribution.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear any existing error on new fetch
        console.log("Loading distribution...");
      })
      .addCase(fetchDistribution.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.distribution = action.payload;
        console.log("Distribution loaded successfully");
      })
      .addCase(fetchDistribution.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Use payload for error message if rejectWithValue was used
        console.error("Error loading distribution:", action.payload);
      });
  },
});

export const { clearError } = profileCountWidgetSlice.actions;

export default profileCountWidgetSlice.reducer;
