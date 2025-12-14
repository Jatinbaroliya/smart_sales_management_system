import { useState, useEffect } from 'react';
import { useSalesData } from '../hooks/useSalesData';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { SortDropdown } from '../components/SortDropdown';
import { SalesTable } from '../components/SalesTable';
import { Pagination } from '../components/Pagination';
import type { FilterOptions } from '../types/sales';
import { SortField } from '../types/sales';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { sales, loading, error, totalPages, currentPage, filterOptions, fetchSales } =
    useSalesData();

  const [search, setSearch] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortField>(SortField.DATE_DESC);
  const [page, setPage] = useState<number>(1);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchSales({
      page,
      pageSize: 10,
      search: debouncedSearch || undefined,
      sort,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    });
  }, [debouncedSearch, filters, sort, page, fetchSales]);

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Retail Sales Management System</h1>
        <div className={styles.divider} />
      </header>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.controls}>
            <SearchBar value={search} onChange={setSearch} />
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          <SalesTable sales={sales} loading={loading} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <aside className={styles.sidebar}>
          <FilterPanel
            filters={filters}
            filterOptions={filterOptions}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />
        </aside>
      </div>
    </div>
  );
}

