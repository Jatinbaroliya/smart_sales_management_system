import type { SaleRecord } from '../types/sales';
import styles from './SalesTable.module.css';

interface SalesTableProps {
  sales: SaleRecord[];
  loading: boolean;
}

export function SalesTable({ sales, loading }: SalesTableProps) {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loading}>Loading sales data...</div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.emptyIcon}
          >
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
          </svg>
          <h3 className={styles.emptyTitle}>No records found</h3>
          <p className={styles.emptyText}>
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {sales.map((sale, index) => (
            <tr key={sale.transactionId} className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td>{formatDate(sale.date)}</td>
              <td className={styles.customerCell}>
                <div className={styles.customerName}>{sale.customerName}</div>
                <div className={styles.customerMeta}>
                  {sale.gender}, {sale.age} yrs
                </div>
              </td>
              <td>{sale.phoneNumber}</td>
              <td>{sale.customerRegion}</td>
              <td>
                <div className={styles.productName}>{sale.productName}</div>
                <div className={styles.productBrand}>{sale.brand}</div>
              </td>
              <td>{sale.productCategory}</td>
              <td className={styles.quantityCell}>{sale.quantity}</td>
              <td className={styles.amountCell}>{formatCurrency(sale.finalAmount)}</td>
              <td>{sale.paymentMethod}</td>
              <td>
                <span className={`${styles.status} ${styles[sale.orderStatus.toLowerCase()] || ''}`}>
                  {sale.orderStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

