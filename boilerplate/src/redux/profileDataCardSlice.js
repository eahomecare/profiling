import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching profile data (kept blank as per your request)
export const fetchProfileData = createAsyncThunk(
  "profileDataCard/fetchProfileData",
  async () => {
    // The API call would go here...
    // For now, return a static representation.
    return [
      { name: "Techies", value: 1244, color: "#E38627", src: "Techie" },
      { name: "Foodies", value: 5242, color: "blue", src: "Foodie" },
      {
        name: "Fitness Freaks",
        value: 13123,
        color: "#FFBB28",
        src: "Fitness Freak",
      },
      { name: "Sports Fans", value: 12320, color: "green", src: "Sports Fan" },
      {
        name: "Avid Travelers",
        value: 3243,
        color: "purple",
        src: "Avid Traveler",
      },
    ];
  },
);

const initialState = {
  hoveredItem: null,
  data: [
    { name: "Techies", value: 21244, color: "#DE896599", src: "Techie" },
    { name: "Foodies", value: 35242, color: "#D8597299", src: "Foodie" },
    {
      name: "Fitness Freaks",
      value: 13123,
      color: "#2745D999",
      src: "Fitness Freak",
    },
    {
      name: "Sports Fans",
      value: 12320,
      color: "#1D982599",
      src: "Sports Fan",
    },
    {
      name: "Avid Travelers",
      value: 13243,
      color: "#80008099",
      src: "Avid Traveler",
    },
  ],
  status: "idle",
  error: null,
};

const profileDataCardSlice = createSlice({
  name: "profileDataCard",
  initialState,
  reducers: {
    setHoveredItem: (state, action) => {
      state.hoveredItem = action.payload;
    },
    clearHoveredItem: (state) => {
      state.hoveredItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the data if payload is available and not empty
        if (action.payload && action.payload.length > 0) {
          state.data = action.payload;
        }
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export reducers to be used in components
export const { setHoveredItem, clearHoveredItem } =
  profileDataCardSlice.actions;

// Selector to get the hovered item (for use in components)
export const selectHoveredItem = (state) => state.profileDataCard.hoveredItem;
// Selector to get profile data
export const selectProfileData = (state) => state.profileDataCard.data;

export default profileDataCardSlice.reducer;
