import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi, clientApi } from '../../api/axios';

interface Client {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    activeApplications?: number;
    totalApplications?: number;
    isBlocked: boolean;
}

interface UserDetails {
    user: {
        _id: string;
        name: string;
        inn: string;
        isBlocked: boolean;
        createdAt: string;
    };
    statistics: {
        activeApplications: number;
        totalApplications: number;
        totalChecks: number;
    };
    applications: Array<{
        id: string;
        status: string[];
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
        checksCount: number;
        totalAmount: number;
        date: {
            start: string;
            end: string;
        };
        user: {
            _id: string;
            name: string;
            inn: string;
        };
    }>;
}

interface SavedCompany {
    id: string;
    name: string;
    inn: string;
    createdAt: string;
}

interface ClientState {
    currentClient: Client | null;
    clients: Client[];
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
    userDetails: UserDetails | null;
    userDetailsLoading: boolean;
    userDetailsError: string | null;
    userInfo: any;
    userInfoLoading: boolean;
    userInfoError: string | null;
    userApplications: any[];
    userApplicationsLoading: boolean;
    userApplicationsError: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
    savedCompanies: SavedCompany[];
    savedCompaniesLoading: boolean;
    savedCompaniesError: string | null;
}

const initialState: ClientState = {
    currentClient: null,
    clients: [],
    isLoading: false,
    error: null,
    isInitialized: false,
    userDetails: null,
    userDetailsLoading: false,
    userDetailsError: null,
    userInfo: null,
    userInfoLoading: false,
    userInfoError: null,
    userApplications: [],
    userApplicationsLoading: false,
    userApplicationsError: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
    },
    savedCompanies: [],
    savedCompaniesLoading: false,
    savedCompaniesError: null,
};

// Создание клиента (для админа)
export const createClient = createAsyncThunk(
    'client/create',
    async (data: { name: string }, { rejectWithValue }) => {
        try {
            const response = await adminApi.post('/users/register', data);
            // Проверяем наличие данных, но не выбрасываем ошибку
            if (response.data) {
                return {
                    ...response.data,
                    // Если key нет в ответе, создаем временный
                    key: response.data.key || 'temporary-key'
                };
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при создании клиента');
        }
    }
);

// Вход клиента
export const loginClient = createAsyncThunk(
    'client/login',
    async (key: string, { rejectWithValue }) => {
        try {
            const response = await clientApi.post('/users/login', { key });
            if (response.data.user.isBlocked) {
                throw new Error('Аккаунт заблокирован');
            }
            localStorage.setItem('client', response.data.token);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка авторизации');
        }
    }
);

// Получение всех клиентов (для админа)
export const getAllClients = createAsyncThunk(
    'client/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminApi.get('/users');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении клиентов');
        }
    }
);

// Удаление клиента (для админа)
export const deleteClient = createAsyncThunk(
    'client/delete',
    async (clientId: string, { rejectWithValue }) => {
        try {
            await clientApi.delete(`/users/${clientId}`);
            return clientId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при удалении клиента');
        }
    }
);

// Добавим новый action для обновления клиента
export const updateClient = createAsyncThunk(
    'client/update',
    async ({ clientId, data }: { clientId: string, data: { name?: string, canSave?: boolean, isBlocked?: boolean } }, { rejectWithValue }) => {
        try {
            const response = await adminApi.put(`/users/${clientId}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении клиента');
        }
    }
);

// Проверка авторизации при загрузке
export const checkClientAuth = createAsyncThunk(
    'client/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('client');
            if (!token) {
                throw new Error('Не авторизован');
            }

            const response = await clientApi.get('/users/me');
            return response.data;
        } catch (error: any) {
            // localStorage.removeItem('client');
            return rejectWithValue(error.response?.data?.message || 'Не авторизован');
        }
    }
);

// Обновляем санк для использования adminApi
export const fetchUserDetails = createAsyncThunk(
    'client/fetchUserDetails',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await adminApi.get<UserDetails>(`/users/${userId}/details`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении данных пользователя');
        }
    }
);

// Добавляем новые санки
export const fetchUserInfo = createAsyncThunk(
    'client/fetchUserInfo',
    async (userId: string) => {
        const response = await adminApi.get(`/users/${userId}/info`);
        return response.data;
    }
);

export const fetchUserApplications = createAsyncThunk(
    'client/fetchUserApplications',
    async ({ userId, filters, pagination }: { 
        userId: string, 
        filters: any, 
        pagination: { page: number, limit: number } 
    }) => {
        const response = await adminApi.get(`/users/${userId}/applications`, {
            params: {
                ...filters,
                ...pagination
            }
        });
        return response.data;
    }
);

export const fetchSavedCompanies = createAsyncThunk(
    'client/fetchSavedCompanies',
    async (_, { rejectWithValue }) => {
        try {
            const response = await clientApi.get('/users/saved-companies');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при получении сохраненных компаний');
        }
    }
);

export const addSavedCompany = createAsyncThunk(
    'client/addSavedCompany',
    async (companyId: string, { rejectWithValue }) => {
        try {
            const response = await clientApi.post(`/users/saved-companies/${companyId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при сохранении компании');
        }
    }
);

export const removeSavedCompany = createAsyncThunk(
    'client/removeSavedCompany',
    async (companyId: string, { rejectWithValue }) => {
        try {
            const response = await clientApi.delete(`/users/saved-companies/${companyId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при удалении компании из сохраненных');
        }
    }
);

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentClient = null;
            localStorage.removeItem('client');
        },
    },
    extraReducers: (builder) => {
        // Создание клиента
        builder.addCase(createClient.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createClient.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.clients.push(action.payload);
            }
        });
        builder.addCase(createClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Логин клиента
        builder.addCase(loginClient.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginClient.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentClient = action.payload;
        });
        builder.addCase(loginClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Получение всех клиентов
        builder.addCase(getAllClients.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllClients.fulfilled, (state, action) => {
            state.isLoading = false;
            state.clients = action.payload;
        });
        builder.addCase(getAllClients.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Удаление клиента
        builder.addCase(deleteClient.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteClient.fulfilled, (state, action) => {
            state.isLoading = false;
            state.clients = state.clients.filter(client => client.id !== action.payload);
        });
        builder.addCase(deleteClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Обновление клиента
        builder.addCase(updateClient.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateClient.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.clients.findIndex(client => client.id === action.payload.id);
            if (index !== -1) {
                state.clients[index] = action.payload;
            }
        });
        builder.addCase(updateClient.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Проверка авторизации при загрузке
        builder.addCase(checkClientAuth.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(checkClientAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentClient = action.payload;
            state.error = null;
            state.isInitialized = true;
        });
        builder.addCase(checkClientAuth.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
            state.currentClient = null;
            state.isInitialized = true;
        });

        // Добавляем обработчики для нового санка
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.userDetailsLoading = true;
                state.userDetailsError = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.userDetailsLoading = false;
                state.userDetails = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.userDetailsLoading = false;
                state.userDetailsError = action.error.message || 'Произошла ошибка при загрузке данных пользователя';
            });

        // Добавляем обработчики для нового санка
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.userInfoLoading = true;
                state.userInfoError = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.userInfoLoading = false;
                state.userInfo = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.userInfoLoading = false;
                state.userInfoError = action.error.message || 'Ошибка при загрузке информации о пользователе';
            })
            .addCase(fetchUserApplications.pending, (state) => {
                state.userApplicationsLoading = true;
                state.userApplicationsError = null;
            })
            .addCase(fetchUserApplications.fulfilled, (state, action) => {
                state.userApplicationsLoading = false;
                state.userApplications = action.payload.applications;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUserApplications.rejected, (state, action) => {
                state.userApplicationsLoading = false;
                state.userApplicationsError = action.error.message || 'Ошибка при загрузке заявок пользователя';
            });

        builder
            .addCase(fetchSavedCompanies.pending, (state) => {
                state.savedCompaniesLoading = true;
                state.savedCompaniesError = null;
            })
            .addCase(fetchSavedCompanies.fulfilled, (state, action) => {
                state.savedCompaniesLoading = false;
                state.savedCompanies = action.payload;
            })
            .addCase(fetchSavedCompanies.rejected, (state, action) => {
                state.savedCompaniesLoading = false;
                state.savedCompaniesError = action.payload as string;
            });
    }
});

export const { logout } = clientSlice.actions;
export default clientSlice.reducer; 