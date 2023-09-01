import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRowData = createAsyncThunk(
    'campaignManagement/fetchRowData',
    async (_, { getState }) => {
        const state = getState().campaignManagement;
        const endpoint = `${process.env.REACT_APP_API_URL}/customers/search_customers_by_attr`;
        const responses = [];

        for (const rowKey of Object.keys(state.rows)) {
            const row = state.rows[rowKey];
            if (!row.first || !row.second || !row.third) {
                throw new Error("Row has empty/default values. Fetching aborted.");
            }

            const body = {
                information_type: row.first.toLowerCase().split(' ').join('_'),
                category: row.second.toLowerCase().split(' ').join('_'),
                value: row.third.toLowerCase().split(' ').join('_')
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            const figures = data.length;
            responses.push({
                rowKey,
                figures
            });
        }
        return responses;
    }

);

export const fetchFiguresForRow = createAsyncThunk(
    'campaignManagement/fetchFiguresForRow',
    async (rowId, { getState }) => {
        const state = getState().campaignManagement;
        const row = state.rows[rowId];
        if (!row || !row.first || !row.second || !row.third) {
            throw new Error("Row data is missing or incomplete. Fetching aborted.");
        }

        const endpoint = `${process.env.REACT_APP_API_URL}/customers/search_customers_by_attr`;

        const body = {
            information_type: row.first.toLowerCase().split(' ').join('_'),
            category: row.second.toLowerCase().split(' ').join('_'),
            value: row.third.toLowerCase().split(' ').join('_')
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        const figures = data.length;

        return { rowId, figures };
    }
);

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
            figures: null
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
    },
    radarData: [
        { count: 120, subject: 'EZ-Auto' },
        { count: 98, subject: 'Cyberior' },
        { count: 86, subject: 'Homecare' },
        { count: 99, subject: 'E-Portal 2.0' },
        { count: 85, subject: 'EZ-Travel' },
    ],
    downloadDataStatus: null,
    error: null,
    rowIdsArray: [],  // Changed from Set to Array
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
            state.rowIdsArray = [];  // Updated reference from Set to Array
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
            state.eventDate = initialState.eventDate
        },
    },
    extraReducers: {
        [fetchRowData.pending]: (state) => {
            state.downloadDataStatus = 'loading';
        },
        [fetchRowData.fulfilled]: (state, action) => {
            state.downloadDataStatus = 'success';

            action.payload.forEach(item => {
                state.rows[item.rowKey].figures = item.figures;
            });

            state.rowIdsArray = [...new Set([...state.rowIdsArray, ...action.payload.map(item => item.rowKey)])];
        },
        [fetchRowData.rejected]: (state, action) => {
            state.downloadDataStatus = 'failed';
            state.error = action.error.message;
        },
        [fetchFiguresForRow.pending]: (state) => {
            state.downloadDataStatus = 'loading';
        },
        [fetchFiguresForRow.fulfilled]: (state, action) => {
            const { rowId, figures } = action.payload;
            state.rows[rowId].figures = figures;
            state.downloadDataStatus = 'success';
        },
        [fetchFiguresForRow.rejected]: (state, action) => {
            state.downloadDataStatus = 'failed';
            state.error = action.error.message;
        },
    }
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
    setRadarData,
    resetModal,
} = campaignManagementSlice.actions;

export const selectRadarData = (state) => state.campaignManagement.radarData;

export default campaignManagementSlice.reducer;