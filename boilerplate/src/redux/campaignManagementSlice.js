import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRowData = createAsyncThunk(
  "campaignManagement/fetchRowData",
  async (_, { getState }) => {
    const state = getState().campaignManagement;
    const endpoint = `${process.env.REACT_APP_API_URL}/customers/search_customers_by_attr`;
    const responses = [];
    let commonCustomerIDs = null; // To keep track of common customer IDs across rows

    for (const rowKey of Object.keys(state.rows)) {
      const row = state.rows[rowKey];
      if (!row.first || !row.second || !row.third) {
        throw new Error("Row has empty/default values. Fetching aborted.");
      }

      const body = {
        information_type: row.first.toLowerCase().split(" ").join("_"),
        category: row.second.toLowerCase().split(" ").join("_"),
        value: row.third.toLowerCase().split(" ").join("_"),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const customerIDsForThisRow = data.map((customer) => customer.id);

      if (commonCustomerIDs === null) {
        commonCustomerIDs = new Set(customerIDsForThisRow);
      } else {
        commonCustomerIDs = new Set(
          [...commonCustomerIDs].filter((id) =>
            customerIDsForThisRow.includes(id),
          ),
        );
      }

      responses.push({
        rowKey,
        figures: commonCustomerIDs.size,
        customerIDs: [...commonCustomerIDs],
      });
    }
    return responses;
  },
);

export const fetchFiguresForRow = createAsyncThunk(
  "campaignManagement/fetchFiguresForRow",
  async (rowId, { getState }) => {
    const state = getState().campaignManagement;
    const row = state.rows[rowId];
    if (!row || !row.first || !row.second || !row.third) {
      throw new Error("Row data is missing or incomplete. Fetching aborted.");
    }

    const endpoint = `${process.env.REACT_APP_API_URL}/customers/search_customers_by_attr`;

    const body = {
      information_type: row.first.toLowerCase().split(" ").join("_"),
      category: row.second.toLowerCase().split(" ").join("_"),
      value: row.third.toLowerCase().split(" ").join("_"),
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const customerIDsForThisRow = data.map((customer) => customer.id);

    // Retrieve customer IDs from all preceding rows
    let commonCustomerIDs = customerIDsForThisRow;
    for (const otherRowId of Object.keys(state.rows)) {
      if (Number(otherRowId) < Number(rowId)) {
        const otherRow = state.rows[otherRowId];
        commonCustomerIDs = commonCustomerIDs.filter((id) =>
          otherRow.customerIDs.includes(id),
        );
      }
    }

    return {
      rowId,
      figures: commonCustomerIDs.length,
      customerIDs: commonCustomerIDs,
    };
  },
);

export const createCampaign = createAsyncThunk(
  "campaignManagement/createCampaign",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().campaignManagement;
    const endpoint = `${process.env.REACT_APP_API_URL}/campaign`;

    const keywordsUsed = state.selectedCombinations
      .filter(
        (combination) => combination.first === "Interests" && combination.third,
      )
      .map((combination) => combination.third.value);

    const body = {
      name: state.eventName,
      eventBased: true,
      triggerTime: state.tabData.Email.timelineState.recurrence.recurrenceTime,
      type: "EMAIL",
      recurrenceType:
        state.tabData.Email.timelineState.recurrence.type.toUpperCase(),
      start: state.tabData.Email.timelineState.startDate,
      end: state.tabData.Email.timelineState.endDate,
      templateText: state.tabData.Email.content,
      customerIDs: state.allCustomerIDs,
      keywordsUsed,
    };

    console.log("Publish body", body);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  isModalOpen: false,
  dropdownData: {
    "Personal Information": {
      Age: ["25-30", "31-35"],
      Gender: ["Male", "Female"],
      "Marital Status": ["Single", "Married"],
      Location: ["Delhi", "Mumbai"],
    },
    Interests: {},
    Occupation: "",
    Activity: "",
    "Family Details": "",
    "Financial Information": "",
    "Insurance Details": "",
    Vehicle: "",
    Health: "",
  },
  rows: {
    [Date.now().toString()]: {
      first: "",
      second: "",
      third: "",
      figures: null,
      customerIDs: [],
    },
  },
  allCustomerIDs: [],
  selectedCombinations: [],
  eventName: "",
  eventDate: null,
  step: 1,
  activeTab: "Email",
  startDate: null,
  endDate: null,
  tabData: {
    Email: {
      content: "",
      timelineState: {},
      fileName: null,
      file: null,
      characterCount: 0,
      charLimit: 500,
    },
    SMS: {
      content: "",
      timelineState: {},
      fileName: null,
      file: null,
      characterCount: 0,
      charLimit: 160,
    },
    Notification: {
      content: "",
      timelineState: {},
      fileName: null,
      file: null,
      characterCount: 0,
      charLimit: 250,
    },
    Whatsapp: {
      content: "",
      timelineState: {},
      fileName: null,
      file: null,
      characterCount: 0,
      charLimit: 2000,
    },
  },
  radarData: [
    { count: 120, subject: "EZ-Auto" },
    { count: 98, subject: "Cyberior" },
    { count: 86, subject: "Homecare" },
    { count: 99, subject: "E-Portal 2.0" },
    { count: 85, subject: "EZ-Travel" },
  ],
  downloadDataStatus: null,
  error: null,
  rowIdsArray: [],
  loadingStates: {},
  errors: {},
};

const campaignManagementSlice = createSlice({
  name: "campaignManagement",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    updateDropdownData: (state, action) => {
      state.dropdownData = action.payload;
    },
    updateRows: (state, action) => {
      state.rows = action.payload;
      state.rowIdsArray = [];
      state.allCustomerIDs = [
        ...new Set(
          Object.values(state.rows)
            .filter((row) => row.customerIDs && row.customerIDs.length)
            .flatMap((row) => row.customerIDs),
        ),
      ];
    },
    updateSelectedCombinations: (state, action) => {
      state.selectedCombinations = action.payload;
    },
    setCampaignName: (state, action) => {
      state.campaignName = action.payload;
    },
    setEventName: (state, action) => {
      state.eventName = action.payload;
    },
    setEventDate: (state, action) => {
      state.eventDate = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
      state.eventDate = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    updateTabData: (state, action) => {
      state.tabData = action.payload;
    },
    setRadarData: (state, action) => {
      state.radarData = action.payload;
    },
    resetModal: (state) => {
      state.step = initialState.step;
      state.campaignName = initialState.campaignName;
      state.eventName = initialState.eventName;
      state.activeTab = initialState.activeTab;
      state.tabData = initialState.tabData;
      state.eventDate = initialState.eventDate;
    },
  },
  extraReducers: {
    [fetchRowData.pending]: (state) => {
      state.downloadDataStatus = "loading";
    },
    [fetchRowData.fulfilled]: (state, action) => {
      state.downloadDataStatus = "success";

      action.payload.forEach((item) => {
        state.rows[item.rowKey].figures = item.figures;
        state.rows[item.rowKey].customerIDs = item.customerIDs;
      });

      state.rowIdsArray = [
        ...new Set([
          ...state.rowIdsArray,
          ...action.payload.map((item) => item.rowKey),
        ]),
      ];

      const lastRowId = Math.max(...state.rowIdsArray.map(Number));
      state.allCustomerIDs = [...state.rows[lastRowId].customerIDs];
    },
    [fetchRowData.rejected]: (state, action) => {
      state.downloadDataStatus = "failed";
      state.error = action.error.message;
    },
    [fetchFiguresForRow.pending]: (state, action) => {
      const rowId = action.meta.arg;
      state.loadingStates[rowId] = "loading";
      state.errors[rowId] = null;
    },
    [fetchFiguresForRow.fulfilled]: (state, action) => {
      const { rowId, figures, customerIDs } = action.payload;
      state.rows[rowId].figures = figures;
      state.rows[rowId].customerIDs = customerIDs;
      state.loadingStates[rowId] = "loaded";

      const lastRowId = Math.max(...Object.keys(state.rows).map(Number));
      if (Number(rowId) === lastRowId) {
        state.allCustomerIDs = [...customerIDs];
      }
    },
    [fetchFiguresForRow.rejected]: (state, action) => {
      const rowId = action.meta.arg;
      state.loadingStates[rowId] = "error";
      state.errors[rowId] = action.error.message;
    },
  },
});

export const {
  toggleModal,
  updateDropdownData,
  updateRows,
  updateSelectedCombinations,
  setCampaignName,
  setEventName,
  setEventDate,
  setStep,
  setStartDate,
  setEndDate,
  setActiveTab,
  updateTabData,
  setRadarData,
  resetModal,
} = campaignManagementSlice.actions;

export const selectRadarData = (state) => state.campaignManagement.radarData;

export default campaignManagementSlice.reducer;
