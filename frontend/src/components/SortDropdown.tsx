import { SortField, type SortField as SortFieldType } from '../types/sales';
import styles from './SortDropdown.module.css';

interface SortDropdownProps {
  value: SortFieldType;
  onChange: (value: SortFieldType) => void;
}

const sortOptions = [
  { value: SortField.DATE_DESC, label: 'Date (Newest First)' },
  { value: SortField.QUANTITY, label: 'Quantity (High to Low)' },
  { value: SortField.CUSTOMER_NAME_ASC, label: 'Customer Name (A-Z)' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className={styles.dropdown}>
      <label htmlFor="sort" className={styles.label}>
        Sort by:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortFieldType)}
        className={styles.select}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

