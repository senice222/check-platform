import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/axios';

interface Seller {
    id: string;
    name: string;
    inn: string;
    tg_link: string;
    type: 'white' | 'elit';
    createdAt: string;
}

interface SellerState {
    sellers: Seller[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SellerState = {
    sellers: [],
    isLoading: false,
    error: null
};

// Получение всех продавцов с фильтрами
export const getAllSellers = createAsyncThunk(
    'seller/getAll',
    async (filters: { search?: string; types?: string[] }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.types?.length) params.append('types', filters.types.join(','));

            const response = await adminApi.get(`/sellers?${params.toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении продавцов');
        }
    }
);

// Создание продавца
export const createSeller = createAsyncThunk(
    'seller/create',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await adminApi.post('/sellers', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при создании продавца');
        }
    }
);

// Обновление продавца
export const updateSeller = createAsyncThunk(
    'seller/update',
    async ({ id, data }: { id: string; data: Partial<Seller> }, { rejectWithValue }) => {
        try {
            const response = await adminApi.put(`/sellers/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении продавца');
        }
    }
);

// Удаление продавца
export const deleteSeller = createAsyncThunk(
    'seller/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminApi.delete(`/sellers/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при удалении продавца');
        }
    }
);

const sellerSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getAllSellers
        builder.addCase(getAllSellers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllSellers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.sellers = action.payload;
            state.error = null;
        });
        builder.addCase(getAllSellers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // createSeller
        builder.addCase(createSeller.fulfilled, (state, action) => {
            state.sellers.unshift(action.payload);
        });

        // updateSeller
        builder.addCase(updateSeller.fulfilled, (state, action) => {
            const index = state.sellers.findIndex(seller => seller.id === action.payload.id);
            if (index !== -1) {
                state.sellers[index] = action.payload;
            }
        });

        // deleteSeller
        builder.addCase(deleteSeller.fulfilled, (state, action) => {
            state.sellers = state.sellers.filter(seller => seller.id !== action.payload);
        });
    }
});

export default sellerSlice.reducer; 