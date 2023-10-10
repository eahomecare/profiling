import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/profile-type-customer-mapping/groupByAll`;

export const fetchProfileData = createAsyncThunk(
  "profileDataCard/fetchProfileData",
  async (requestBody, { getState }) => {
    console.log("Entered from dispatch", requestBody);
    const { profileTypeDemoStats } = getState().profileDataCard;
    console.log("profileTypeDemoStats", profileTypeDemoStats);

    if (
      requestBody.profileType &&
      requestBody.demographic &&
      profileTypeDemoStats[requestBody.profileType] &&
      profileTypeDemoStats[requestBody.profileType][requestBody.demographic]
    ) {
      return {};
    }

    const response = await axios.post(API_URL, requestBody);
    console.log("Response ", response);

    if (requestBody.profileType && requestBody.demographic) {
      const demographicData = response.data[requestBody.demographic];
      return {
        profileType: requestBody.profileType,
        demographic: requestBody.demographic,
        data: demographicData,
        requestBody,
      };
    }

    const transformedData = response.data.profiles.map((profile) => {
      const displayName =
        initialState.displayAndColorMappings[profile.profileType].displayName ||
        profile.profileType;
      return {
        name: `${displayName}`,
        value: profile.count,
        color:
          initialState.displayAndColorMappings[profile.profileType].color ||
          "#DE896599",
        src: `${displayName}`,
      };
    });

    const totalCount = transformedData.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    return {
      transformedData,
      totalCount,
      requestBody,
    };
  },
);

const initialState = {
  hoveredItem: null,
  data: [],
  totalCount: 0,
  status: "idle",
  error: null,
  profileTypeDemoStats: {},
  requestBody: null,
  displayAndColorMappings: {
    food: { displayName: "Foodie", color: "#DE896599" },
    sports: { displayName: "Sports Fan", color: "#D8597299" },
    travel: { displayName: "Avid Traveller", color: "#2745D999" },
    music: { displayName: "Musicophile", color: "#1D982599" },
    fitness: { displayName: "Fitness Freak", color: "#80008099" },
    automobile: { displayName: "Auto Lover", color: "#E2768D" },
    gadget: { displayName: "Gadgets Freaks", color: "#56C3A6" },
    technology: { displayName: "Techie", color: "#EBD43B" },
  },
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
        // console.log("profileDataCard:\n", action.payload);

        if (action.payload.transformedData) {
          state.data = action.payload.transformedData;
          state.totalCount = action.payload.totalCount;
        }

        if (action.payload.profileType && action.payload.demographic) {
          if (!state.profileTypeDemoStats[action.payload.profileType]) {
            state.profileTypeDemoStats[action.payload.profileType] = {};
          }
          state.profileTypeDemoStats[action.payload.profileType][
            action.payload.demographic
          ] = action.payload.data;
        }

        state.requestBody = action.payload.requestBody;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setHoveredItem, clearHoveredItem } =
  profileDataCardSlice.actions;

export const selectHoveredItem = (state) => state.profileDataCard.hoveredItem;
export const selectProfileData = (state) => state.profileDataCard.data;
export const selectRequestBody = (state) => state.profileDataCard.requestBody;
export const selectProfileTypeDemoStats = (state) =>
  state.profileDataCard.profileTypeDemoStats;

export default profileDataCardSlice.reducer;
