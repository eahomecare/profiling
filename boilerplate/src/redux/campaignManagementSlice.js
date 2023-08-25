import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false,
    dropdownData: {
        "Personal Information": {
            "Date of Birth": ["25 - 30 years", "31 - 35 years"],
            "Gender": ["Male", "Female"]
        },
        "Interests": {}
    },
    rows: {
        [Date.now().toString()]: {
            first: "",
            second: "",
            third: "",
        }
    },
    selectedCombinations: [],
    campaignName: "",
    eventName: "",
    step: 1,
    activeTab: 'Email',
    tabData: {
        Email: {
            content: '',
            timelineState: {},
            file: null
        },
        SMS: {
            content: '',
            timelineState: {},
            file: null
        },
        Notification: {
            content: '',
            timelineState: {},
            file: null
        },
        Whatsapp: {
            content: '',
            timelineState: {},
            file: null
        }
    }
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
        setStep: (state, action) => {
            state.step = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        updateTabData: (state, action) => {
            state.tabData = action.payload;
        },
        resetModal: (state) => {
            state.step = initialState.step;
            state.campaignName = initialState.campaignName;
            state.eventName = initialState.eventName;
            state.activeTab = initialState.activeTab;
            state.tabData = initialState.tabData
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
    setStep,
    setActiveTab,
    updateTabData,
    resetModal
} = campaignManagementSlice.actions;

export default campaignManagementSlice.reducer;