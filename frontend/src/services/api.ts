import axios from 'axios';
import type { APIResponse, SaleRecord, SalesQuery, FilterOptionsData } from '../types/sales';

// Use Vite-exposed env var `VITE_BACKEND_API_BASE_URL` when provided at build time.
// Fallback to a relative `/api` so the frontend can call the backend when served from the same origin.
// Runtime fallbacks: read a meta tag (`<meta name="backend-api" content="https://.../api">`) or
// `window.__BACKEND_API_BASE_URL` so you can change the backend URL without rebuilding.
function getRuntimeBackendUrl(): string {
  // build-time Vite var (preferred)
  // Vite exposes build-time env on `import.meta.env` (typed only in Vite builds)
  // Access safely to avoid TS compile error in other contexts.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const buildVar = import.meta.env && import.meta.env.VITE_BACKEND_API_BASE_URL;
  if (buildVar) return buildVar;

  // runtime meta tag (can be edited on the deployed `index.html`)
  try {
    if (typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="backend-api"]') as HTMLMetaElement | null;
      if (meta && meta.content) return meta.content;
    }
  } catch (e) {}

  // runtime global (set by server or script): window.__BACKEND_API_BASE_URL
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = (window as any);
    if (w && w.__BACKEND_API_BASE_URL) return w.__BACKEND_API_BASE_URL;
  } catch (e) {}

  return '/api';
}

const API_BASE_URL = getRuntimeBackendUrl();

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

