export interface SaleRecord {
  transactionId: number;
  date: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  gender: string;
  age: number;
  customerRegion: string;
  customerType: string;
  productId: string;
  productName: string;
  brand: string;
  productCategory: string;
  tags: string;
  quantity: number;
  pricePerUnit: number;
  discountPercentage: number;
  totalAmount: number;
  finalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  deliveryType: string;
  storeId: string;
  storeLocation: string;
  salespersonId: string;
  employeeName: string;
}

export interface APIResponse<T> {
  data: T;
  totalPages: number;
  currentPage: number;
}

export interface FilterOptions {
  region?: string[];
  gender?: string[];
  ageRange?: {
    min?: number;
    max?: number;
  };
  category?: string[];
  tags?: string[];
  paymentMethod?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export const SortField = {
  DATE_DESC: 'date_desc',
  QUANTITY: 'quantity',
  CUSTOMER_NAME_ASC: 'customer_name_asc',
} as const;

export type SortField = 'date_desc' | 'quantity' | 'customer_name_asc';

export interface SalesQuery {
  page: number;
  pageSize: number;
  search?: string;
  sort?: SortField;
  filters?: FilterOptions;
}

export interface FilterOptionsData {
  regions: string[];
  genders: string[];
  categories: string[];
  paymentMethods: string[];
  tags: string[];
  ageRange: { min: number; max: number };
  dateRange: { start: string; end: string };
}

