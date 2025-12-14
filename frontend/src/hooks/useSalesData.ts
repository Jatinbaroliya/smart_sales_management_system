import { useState, useEffect, useCallback } from 'react';
import { salesAPI } from '../services/api';
import type { SaleRecord, SalesQuery, FilterOptionsData } from '../types/sales';
import { SortField } from '../types/sales';

interface UseSalesDataReturn {
  sales: SaleRecord[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  filterOptions: FilterOptionsData | null;
  fetchSales: (query: SalesQuery) => Promise<void>;
}

export function useSalesData(): UseSalesDataReturn {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsData | null>(null);

  const fetchSales = useCallback(async (query: SalesQuery) => {
    setLoading(true);
    setError(null);
    try {
      const response = await salesAPI.getSales(query);
      setSales(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales data');
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load filter options on mount
    salesAPI
      .getFilterOptions()
      .then((options) => {
        setFilterOptions(options);
      })
      .catch((err) => {
        console.error('Failed to load filter options:', err);
      });
  }, []);

  return {
    sales,
    loading,
    error,
    totalPages,
    currentPage,
    filterOptions,
    fetchSales,
  };
}

