import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi, clientApi } from '../../api/axios';

export const fetchChecks = createAsyncThunk(
    'check/fetchChecks',
    async ({ filters, pagination }: { filters: any, pagination: { page: number, limit: number } }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            
            // Обрабатываем массивы
            if (filters.companies?.length) {
                queryParams.append('companies', filters.companies.join(','));
            }
            if (filters.sellers?.length) {
                queryParams.append('sellers', filters.sellers.join(','));
            }

            // Обрабатываем даты
            if (filters.dateStart) {
                queryParams.append('dateStart', filters.dateStart);
            }
            if (filters.dateEnd) {
                queryParams.append('dateEnd', filters.dateEnd);
            }

            // Обрабатываем фильтры по сумме
            if (filters.sumFrom) {
                queryParams.append('sumFrom', filters.sumFrom.toString());
            }
            if (filters.sumTo) {
                queryParams.append('sumTo', filters.sumTo.toString());
            }

            // Добавляем поиск если есть
            if (filters.search) {
                queryParams.append('search', filters.search);
            }

            // Добавляем пагинацию
            queryParams.append('page', pagination.page.toString());
            queryParams.append('limit', pagination.limit.toString());

            const response = await adminApi.get(`/checks?${queryParams.toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении чеков');
        }
    }
);

const checkSlice = createSlice({
    name: 'check',
    initialState: {
        checks: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0
        },
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChecks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchChecks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checks = action.payload.checks;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchChecks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export default checkSlice.reducer; 