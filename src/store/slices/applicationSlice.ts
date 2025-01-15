import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi, clientApi } from '../../api/axios';
import { ApplicationStatus } from '../../constants/statuses';
import { addHistoryRecord } from './historySlice';
import { RootState } from '../../store';

// Добавляем интерфейс Application
interface Application {
    id: string;
    user: {
        id: string;
        name: string;
        inn: string;
    };
    company: {
        id: string;
        name: string;
        inn: string;
    };
    seller: {
        id: string;
        name: string;
        inn: string;
    };
    status: ApplicationStatus[];
    totalAmount: number;
    checksCount: number;
    createdAt: string;
    date: {
        start: string;
        end: string;
    };
}

interface ApplicationFilters {
    clients?: string[];
    companies?: string[];
    sellers?: string[];
    statuses?: string[];
    dateStart?: string;
    dateEnd?: string;
    sumFrom?: string;
    sumTo?: string;
    search?: string;
}

interface PaginationParams {
    page: number;
    limit: number;
}

interface ApplicationsResponse {
    applications: Application[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// Добавляем интерфейс для данных создания заявки
interface CreateApplicationData {
    companyName: string;
    companyInn: string;
    sellerId: string;
    shouldSaveCompany: boolean;
    checks: {
        date: string;
        product: string;
        quantity: number;
        pricePerUnit: number;
        unit: string;
    }[];
}

// Возвращаем экшен createApplication
export const createApplication = createAsyncThunk(
    'application/create',
    async (data: CreateApplicationData, { rejectWithValue }) => {
        try {
            const response = await clientApi.post('/applications', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при создании заявки');
        }
    }
);

export const fetchApplications = createAsyncThunk(
    'application/fetchApplications',
    async ({ filters, pagination, activeOnly = false }: { 
        filters: any, 
        pagination: { page: number, limit: number },
        activeOnly?: boolean
    }) => {
        try {
            const queryParams = new URLSearchParams();
            
            queryParams.append('activeOnly', activeOnly.toString());
            
            Object.entries(filters).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    queryParams.append(key, value.join(','));
                } else if (value) {
                    queryParams.append(key, value);
                }
            });

            queryParams.append('page', pagination.page.toString());
            queryParams.append('limit', pagination.limit.toString());

            const response = await adminApi.get<ApplicationsResponse>(`/applications?${queryParams.toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении заявок');
        }
    }
);

export interface ApplicationDetails {
    id: string;
    status: ApplicationStatus[];
    seller: {
        id: string;
        name: string;
        inn: string;
    };
    company: {
        id: string;
        name: string;
        inn: string;
    };
    user: {
        id: string;
        name: string;
    };
    commission: {
        percentage: string;
        amount: string;
    };
    dates: {
        start: string | null;
        end: string | null;
    };
    checksCount: number;
    totalAmount: string;
    vat: string;
    checks: Array<{
        id: string;
        date: string;
        product: string;
        quantity: number;
        pricePerUnit: number;
        unit: string;
        totalPrice: number;
    }>;
    history: {
        type: 'status' | 'change';
        admin: {
            id: string;
            name: string;
        };
        message: string;
        status?: string;
        createdAt: string;
    }[];
}

export const fetchApplicationDetails = createAsyncThunk(
    'application/fetchDetails',
    async (applicationId: string, { rejectWithValue }) => {
        try {
            const response = await adminApi.get(`/applications/${applicationId}/details`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении деталей заявки');
        }
    }
);

export const updateApplicationStatus = createAsyncThunk(
    'application/updateStatus',
    async ({ 
        applicationId, 
        status 
    }: { 
        applicationId: string; 
        status: ApplicationStatus[] 
    }, { dispatch }) => {
        try {
            const response = await adminApi.patch(`/applications/${applicationId}/status`, {
                status
            });

            // После успешного обновления статуса, обновляем историю
            await dispatch(fetchApplicationHistory(applicationId));
            
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || 'Ошибка при обновлении статуса';
        }
    }
);

export const updateApplicationInfo = createAsyncThunk(
    'application/updateInfo',
    async ({ applicationId, data }: { applicationId: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await adminApi.put(`/applications/${applicationId}`, { data });
            return response.data;
        } catch (error: any) {
            // Улучшаем извлечение сообщения об ошибке
            const errorMessage = 
                error.response?.data?.message || // Сообщение от сервера
                error.response?.data?.error ||   // Альтернативное поле для ошибки
                error.message ||                 // Сообщение из объекта ошибки
                'Произошла ошибка при обновлении';
            
            console.error('Server Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: errorMessage
            });
            
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateApplicationStatusOnly = createAsyncThunk(
    'application/updateStatusOnly',
    async ({ applicationId, statuses }: { applicationId: string; statuses: ApplicationStatus[] }, { rejectWithValue }) => {
        try {
            const response = await adminApi.put(`/applications/${applicationId}/status`, { statuses });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении статуса');
        }
    }
);

export const updateApplication = createAsyncThunk(
    'application/update',
    async ({ 
        applicationId, 
        data, 
        adminId 
    }: { 
        applicationId: string; 
        data: any; 
        adminId: string; 
    }, { dispatch, rejectWithValue }) => {
        try {
            const response = await adminApi.put(`/applications/${applicationId}`, {
                data
            });

            // После успешного обновления заявки, обновляем историю
            await dispatch(fetchApplicationHistory(applicationId));
            
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении заявки');
        }
    }
);

// Добавим новый интерфейс для истории
interface HistoryRecord {
    id: string;
    type: 'status' | 'change';
    message: string;
    status?: string;
    action?: 'add' | 'remove';
    userId?: string;
    userName?: string;
    createdAt: string;
}

// Добавим новый thunk
export const fetchApplicationHistory = createAsyncThunk(
    'application/fetchHistory',
    async (applicationId: string, { rejectWithValue }) => {
        try {
            const response = await adminApi.get<HistoryRecord[]>(`/applications/${applicationId}/history`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении истории');
        }
    }
);

export const fetchActiveApplicationsCount = createAsyncThunk(
    'applications/fetchActiveCount',
    async () => {
        const response = await adminApi.get('/applications/active/count');
        return response.data;
    }
);

interface ApplicationState {
    applications: Application[];
    currentApplication: ApplicationDetails | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
    isLoading: boolean;
    error: string | null;
    history: HistoryRecord[];
    historyLoading: boolean;
    historyError: string | null;
    activeCount: number;
}

const initialState: ApplicationState = {
    applications: [],
    currentApplication: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    },
    isLoading: false,
    error: null,
    history: [],
    historyLoading: false,
    historyError: null,
    activeCount: 0
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createApplication.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createApplication.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentApplication = action.payload;
                if (action.payload) {
                    state.applications = [...state.applications, action.payload];
                }
            })
            .addCase(createApplication.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchApplications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.applications = action.payload.applications;
                state.pagination = {
                    ...state.pagination,
                    ...action.payload.pagination,
                    page: action.payload.pagination.page || 1,
                    pages: action.payload.pagination.pages || 1
                };
                state.isLoading = false;
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchApplicationDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchApplicationDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentApplication = action.payload;
            })
            .addCase(fetchApplicationDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateApplicationStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.currentApplication) {
                    
                    state.currentApplication.status = action.payload.status;
                }
                const application = state.applications.find(app => app.id === action.payload.id);
                if (application) {
                    application.status = action.payload.status;
                }
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateApplicationInfo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateApplicationInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentApplication = action.payload;
            })
            .addCase(updateApplicationInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateApplicationStatusOnly.fulfilled, (state, action) => {
                if (state.currentApplication) {
                    const newStatus = Array.isArray(action.payload.status) 
                        ? [...action.payload.status] 
                        : [action.payload.status];
                        
                    state.currentApplication.status = newStatus;
                    
                    const application = state.applications.find(app => app.id === action.payload.id);
                    if (application) {
                        application.status = newStatus;
                    }
                }
            })
            .addCase(updateApplication.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentApplication = action.payload;
            })
            .addCase(updateApplication.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchApplicationHistory.pending, (state) => {
                state.historyLoading = true;
                state.historyError = null;
            })
            .addCase(fetchApplicationHistory.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.history = action.payload;
            })
            .addCase(fetchApplicationHistory.rejected, (state, action) => {
                state.historyLoading = false;
                state.historyError = action.payload as string;
            })
            .addCase(fetchActiveApplicationsCount.fulfilled, (state, action) => {
                state.activeCount = action.payload.count;
            });
    }
});

export default applicationSlice.reducer;

// Добавляем селектор для получения количества активных заявок
export const selectActiveApplicationsCount = (state: RootState) => state.application.activeCount; 