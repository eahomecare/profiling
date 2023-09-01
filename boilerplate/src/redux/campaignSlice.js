import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk(
    'campaign/fetchData',
    async () => {
        const response = {
            data: [],
        };
        return response.data;
    }
);

export const fetchSources = createAsyncThunk(
    'campaign/fetchSources',
    async () => {
        const response = {
            sources: [],
        };
        return response.sources;
    }
);

export const fetchCampaignNames = createAsyncThunk(
    'campaign/fetchCampaignNames',
    async () => {
        const response = {
            campaignNames: [],
        };
        return response.campaignNames;
    }
);

const initialState = {
    data: [{
        name: 'Campaign Name 1',
        contactability: 4000,
        interested: 3000,
        converted: 2000,
        over: 100,
        total: 7100
    },
    {
        name: 'Campaign Name 2',
        contactability: 9000,
        interested: 6500,
        converted: 4500,
        over: 300,
        total: 20300
    },
    {
        name: 'Campaign Name 3',
        contactability: 5000,
        interested: 3700,
        converted: 2500,
        over: 150,
        total: 11350
    },
    {
        name: 'Campaign Name 4',
        contactability: 5500,
        interested: 4000,
        converted: 2700,
        over: 180,
        total: 12380
    },
    {
        name: 'Campaign Name 5',
        contactability: 4800,
        interested: 3400,
        converted: 2300,
        over: 120,
        total: 10620
    },
    {
        name: 'Campaign Name 6',
        contactability: 4700,
        interested: 3300,
        converted: 2200,
        over: 110,
        total: 10310
    },
    {
        name: 'Campaign Name 7',
        contactability: 4600,
        interested: 3200,
        converted: 2100,
        over: 100,
        total: 10000
    },
    ],
    sources: ['Homecare', 'Cyberior', 'EZ-Auto', 'EZ-Travel', 'E-Portal 2.0'],
    campaignNames: ['Campaign 1', 'Campaign 2', 'Campaign 3'],
    status: 'idle',
    error: null,
};

const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload && action.payload.length > 0) {
                    state.data = action.payload;
                }
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
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