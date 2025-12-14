import axios from 'axios';
import type { APIResponse, SaleRecord, SalesQuery, FilterOptionsData } from '../types/sales';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const salesAPI = {
  getSales: async (query: SalesQuery): Promise<APIResponse<SaleRecord[]>> => {
    const params = new URLSearchParams();
    
    params.append('page', query.page.toString());
    params.append('pageSize', query.pageSize.toString());
    
    if (query.search) {
      params.append('search', query.search);
    }
    
    if (query.sort) {
      params.append('sort', query.sort);
    }
    
    if (query.filters) {
      if (query.filters.region) {
        query.filters.region.forEach((r) => params.append('region', r));
      }
      if (query.filters.gender) {
        query.filters.gender.forEach((g) => params.append('gender', g));
      }
      if (query.filters.category) {
        query.filters.category.forEach((c) => params.append('category', c));
      }
      if (query.filters.tags) {
        query.filters.tags.forEach((t) => params.append('tags', t));
      }
      if (query.filters.paymentMethod) {
        query.filters.paymentMethod.forEach((p) => params.append('paymentMethod', p));
      }
      if (query.filters.ageRange?.min !== undefined) {
        params.append('ageMin', query.filters.ageRange.min.toString());
      }
      if (query.filters.ageRange?.max !== undefined) {
        params.append('ageMax', query.filters.ageRange.max.toString());
      }
      if (query.filters.dateRange?.start) {
        params.append('dateStart', query.filters.dateRange.start);
      }
      if (query.filters.dateRange?.end) {
        params.append('dateEnd', query.filters.dateRange.end);
      }
    }
    
    const response = await apiClient.get<APIResponse<SaleRecord[]>>('/sales', {
      params,
    });
    return response.data;
  },

  getFilterOptions: async (): Promise<FilterOptionsData> => {
    const response = await apiClient.get<FilterOptionsData>('/sales/filter-options');
    return response.data;
  },
};

