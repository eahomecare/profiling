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
    eventName: "",
    eventDate: null,
    step: 1,
    activeTab: 'Email',
    startDate: null,
    endDate: null,
    tabData: {
        Email: {
            content: '',
            timelineState: {},
            fileName: null,
            file: null,
            characterCount: 0,
            charLimit: 500
        },
        SMS: {
            content: '',
            timelineState: {},
            fileName: null,
            file: null,
            characterCount: 0,
            charLimit: 160
        },
        Notification: {
            content: '',
            timelineState: {},
            fileName: null,
            file: null,
            characterCount: 0,
            charLimit: 250
        },
        Whatsapp: {
            content: '',
            timelineState: {},
            fileName: null,
            file: null,
            characterCount: 0,
            charLimit: 2000
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
    setEventDate,
    setStartDate,
    setEndDate,
    setStep,
    setActiveTab,
    updateTabData,
    resetModal,
} = campaignManagementSlice.actions;

export default campaignManagementSlice.reducer;