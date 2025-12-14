import type { FilterOptions, FilterOptionsData } from '../types/sales';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  filters: FilterOptions;
  filterOptions: FilterOptionsData | null;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
}: FilterPanelProps) {
  if (!filterOptions) {
    return <div className={styles.panel}>Loading filter options...</div>;
  }

  const handleMultiSelect = (
    key: keyof FilterOptions,
    value: string,
    checked: boolean
  ) => {
    const current = (filters[key] as string[]) || [];
    const updated = checked
      ? [...current, value]
      : current.filter((item) => item !== value);
    onFiltersChange({ ...filters, [key]: updated.length > 0 ? updated : undefined });
  };

  const handleAgeRange = (type: 'min' | 'max', value: number) => {
    const ageRange = filters.ageRange || {};
    onFiltersChange({
      ...filters,
      ageRange: {
        ...ageRange,
        [type]: value || undefined,
      },
    });
  };

  const handleDateRange = (type: 'start' | 'end', value: string) => {
    const dateRange = filters.dateRange || {};
    onFiltersChange({
      ...filters,
      dateRange: {
        ...dateRange,
        [type]: value || undefined,
      },
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => {
      const value = filters[key as keyof FilterOptions];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some((v) => v !== undefined && v !== '');
      }
      return false;
    }
  );

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className={styles.clearButton}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {/* Region Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Region</label>
          <div className={styles.checkboxGroup}>
            {filterOptions.regions.map((region) => (
              <label key={region} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.region?.includes(region) || false}
                  onChange={(e) =>
                    handleMultiSelect('region', region, e.target.checked)
                  }
                  className={styles.checkbox}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Gender</label>
          <div className={styles.checkboxGroup}>
            {filterOptions.genders.map((gender) => (
              <label key={gender} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.gender?.includes(gender) || false}
                  onChange={(e) =>
                    handleMultiSelect('gender', gender, e.target.checked)
                  }
                  className={styles.checkbox}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Range Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>
            Age Range: {filters.ageRange?.min || filterOptions.ageRange.min} -{' '}
            {filters.ageRange?.max || filterOptions.ageRange.max}
          </label>
          <div className={styles.rangeInputs}>
            <input
              type="number"
              min={filterOptions.ageRange.min}
              max={filterOptions.ageRange.max}
              value={filters.ageRange?.min || filterOptions.ageRange.min}
              onChange={(e) =>
                handleAgeRange('min', parseInt(e.target.value, 10))
              }
              className={styles.rangeInput}
              placeholder="Min"
            />
            <span className={styles.rangeSeparator}>-</span>
            <input
              type="number"
              min={filterOptions.ageRange.min}
              max={filterOptions.ageRange.max}
              value={filters.ageRange?.max || filterOptions.ageRange.max}
              onChange={(e) =>
                handleAgeRange('max', parseInt(e.target.value, 10))
              }
              className={styles.rangeInput}
              placeholder="Max"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Category</label>
          <div className={styles.checkboxGroup}>
            {filterOptions.categories.map((category) => (
              <label key={category} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.category?.includes(category) || false}
                  onChange={(e) =>
                    handleMultiSelect('category', category, e.target.checked)
                  }
                  className={styles.checkbox}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Payment Method</label>
          <div className={styles.checkboxGroup}>
            {filterOptions.paymentMethods.map((method) => (
              <label key={method} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.paymentMethod?.includes(method) || false}
                  onChange={(e) =>
                    handleMultiSelect('paymentMethod', method, e.target.checked)
                  }
                  className={styles.checkbox}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Date Range</label>
          <div className={styles.dateInputs}>
            <input
              type="date"
              value={filters.dateRange?.start || ''}
              min={filterOptions.dateRange.start}
              max={filterOptions.dateRange.end}
              onChange={(e) => handleDateRange('start', e.target.value)}
              className={styles.dateInput}
            />
            <span className={styles.rangeSeparator}>to</span>
            <input
              type="date"
              value={filters.dateRange?.end || ''}
              min={filterOptions.dateRange.start}
              max={filterOptions.dateRange.end}
              onChange={(e) => handleDateRange('end', e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

