import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/axios';

interface HistoryRecord {
    id: string;
    action: string;
    changes: {
        field: string;
        oldValue: any;
        newValue: any;
    };
    author: string;
    createdAt: string;
}

interface HistoryState {
    records: HistoryRecord[];
    isLoading: boolean;
    error: string | null;
}

export const fetchHistory = createAsyncThunk(
    'history/fetch',
    async (applicationId: string, { rejectWithValue }) => {
        try {
            const response = await adminApi.get(`/history/application/${applicationId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении истории');
        }
    }
);

export const addHistoryRecord = createAsyncThunk(
    'history/add',
    async (data: {
        applicationId: string;
        action: string;
        changes?: {
            field?: string;
            oldValue?: any;
            newValue?: any;
        };
    }, { rejectWithValue }) => {
        try {
            const response = await adminApi.post('/history', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при добавлении записи в историю');
        }
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState: {
        records: [],
        isLoading: false,
        error: null
    } as HistoryState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.records = action.payload;
            })
            .addCase(fetchHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(addHistoryRecord.fulfilled, (state, action) => {
                state.records.unshift(action.payload);
            });
    }
});

export default historySlice.reducer; 