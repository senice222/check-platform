import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/axios';

interface Company {
  id: string;
  name: string;
  inn: string;
  activeApplications: number;
  totalApplications: number;
  createdAt: string;
}

interface CompanyDetails {
  id: string;
  name: string;
  inn: string;
  activeApplications: number;
  totalApplications: number;
  createdAt: string;
}

interface CompanyState {
  companies: Company[];
  companyDetails: CompanyDetails | null;
  companyApplications: any[]; // Тип можно уточнить позже
  applicationsPagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  isLoading: boolean;
  isLoadingApplications: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: CompanyState = {
  companies: [],
  companyDetails: null,
  companyApplications: [],
  applicationsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  isLoading: false,
  isLoadingApplications: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

interface FetchCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchCompanies = createAsyncThunk(
  'company/fetchCompanies',
  async (params: FetchCompaniesParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = '' } = params;
      const response = await adminApi.get('/companies', {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении компаний');
    }
  }
);

// Получение детальной информации о компании
export const fetchCompanyDetails = createAsyncThunk(
  'company/fetchCompanyDetails',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await adminApi.get(`/companies/${companyId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении информации о компании');
    }
  }
);

// Получение заявок компании
export const fetchCompanyApplications = createAsyncThunk(
  'company/fetchCompanyApplications',
  async ({ 
    companyId, 
    filters, 
    pagination 
  }: { 
    companyId: string, 
    filters?: any, 
    pagination: { page: number, limit: number } 
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.dateStart) queryParams.append('dateStart', filters.dateStart);
        if (filters.dateEnd) queryParams.append('dateEnd', filters.dateEnd);
        if (filters.statuses?.length) queryParams.append('statuses', filters.statuses.join(','));
        if (filters.sellers?.length) queryParams.append('sellers', filters.sellers.join(','));
        if (filters.clients?.length) queryParams.append('clients', filters.clients.join(','));
        if (filters.sumFrom) queryParams.append('sumFrom', filters.sumFrom.toString());
        if (filters.sumTo) queryParams.append('sumTo', filters.sumTo.toString());
      }

      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());

      const response = await adminApi.get(`/companies/${companyId}/applications?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении заявок компании');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/update',
  async ({ companyId, data }: { companyId: string, data: { name: string } }, { rejectWithValue }) => {
    try {
      const response = await adminApi.put(`/companies/${companyId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении компании');
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload.companies;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Обработка fetchCompanyDetails
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companyDetails = action.payload;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Обработка fetchCompanyApplications
      .addCase(fetchCompanyApplications.pending, (state) => {
        state.isLoadingApplications = true;
        state.error = null;
      })
      .addCase(fetchCompanyApplications.fulfilled, (state, action) => {
        state.isLoadingApplications = false;
        state.companyApplications = action.payload.applications;
        state.applicationsPagination = action.payload.pagination;
      })
      .addCase(fetchCompanyApplications.rejected, (state, action) => {
        state.isLoadingApplications = false;
        state.error = action.payload as string;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        if (state.companyDetails) {
          state.companyDetails.name = action.payload.name;
        }
      });
  }
});

export default companySlice.reducer; 