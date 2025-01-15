import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/axios';
import { IAdminCreateData } from '../../types/admin.types';

// Проверка авторизации при загрузке
export const checkAuth = createAsyncThunk(
    'admin/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
              console.log('error1')
                throw new Error('Не авторизован');
            }

            const response = await adminApi.get('/admin/profile');
            
            if (!response.data) {
              console.log('error')
                throw new Error('Ошибка получения данных');
            }
            
            return response.data;
        } catch (error: any) {
            // localStorage.removeItem('token');
            throw error;
        }
    }
);

export const loginAdmin = createAsyncThunk(
    'admin/login',
    async (data: { login: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await adminApi.post('/admin/login', data);
            if (!response.data.token || !response.data.admin) {
                console.log(123)
                throw new Error('Некорректный ответ от сервера');
            }
            console.log(response.data, 1221)

            localStorage.setItem('token', response.data.token);
            return response.data.admin;
        } catch (error: any) {
          console.log(error, 111)
            return rejectWithValue(error.response?.data?.message || 'Ошибка авторизации');
        }
    }
);

export const getAdminProfile = createAsyncThunk(
  'admin/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.get('/admin/getProfile');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Произошла ошибка при получении профиля администратора');
    }
  }
);

export const getAllAdmins = createAsyncThunk(
  'admin/getAllAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const {data} = await adminApi.get('/admin/all');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Произошла ошибка при получении списка администраторов');
    }
  }
);

export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (data: IAdminCreateData, { rejectWithValue }) => {
    try {
      const response = await adminApi.post('/admin/register', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Произошла ошибка при создании администратора');
    }
  }
);

export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ adminId, data }: { adminId: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await adminApi.put(`/admin/updateAdmin/${adminId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Произошла ошибка при обновлении администратора');
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  'admin/deleteAdmin',
  async (adminId: string, { rejectWithValue }) => {
    try {
      console.log(adminId, 22)
      const {data} = await adminApi.delete(`/admin/${adminId}`);
      console.log(data, 11)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Произошла ошибка при удалении администратора');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admins: [],
    currentAdmin: null,
    isLoading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.currentAdmin = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAdmin = action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentAdmin = null;
      })
      // login
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAdmin = action.payload;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // getAdminProfile
      .addCase(getAdminProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAdmin = action.payload;
        state.error = null;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // getAllAdmins
      .addCase(getAllAdmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = action.payload;
        state.error = null;
      })
      .addCase(getAllAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createAdmin
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.admins.push(action.payload);
      })
      // updateAdmin
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex(admin => admin.id === action.payload.id);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
        if (state.currentAdmin && state.currentAdmin.id === action.payload.id) {
          state.currentAdmin = action.payload;
        }
      })
      // deleteAdmin
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter(admin => admin.id !== action.payload.id);
        state.error = null;
      });
  }
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer; 