import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/axios';

interface SelectorsState {
    companies: Array<{ id: string; name: string; inn: string; }>;
    sellers: Array<{ id: string; name: string; inn: string; }>;
    users: Array<{ id: string; name: string; inn: string; }>;
    isLoading: boolean;
    error: string | null;
}

const initialState: SelectorsState = {
    companies: [],
    sellers: [],
    users: [],
    isLoading: false,
    error: null
};

export const fetchSelectors = createAsyncThunk(
    'selectors/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminApi.get('/applications/selectors');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении данных');
        }
    }
);

const selectorsSlice = createSlice({
    name: 'selectors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSelectors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSelectors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.companies = action.payload.companies;
                state.sellers = action.payload.sellers;
                state.users = action.payload.users;
            })
            .addCase(fetchSelectors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export default selectorsSlice.reducer; 