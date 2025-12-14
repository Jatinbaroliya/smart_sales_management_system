import type { SaleRecord } from '../models/SaleRecord.js';
import type { SalesQuery } from '../models/SalesQuery.js';
import type { FilterOptions } from '../models/FilterOptions.js';
import { SortField } from '../models/SortOptions.js';

export class SalesService {
  private salesData: SaleRecord[] = [];

  setSalesData(data: SaleRecord[]): void {
    this.salesData = data;
  }

  getSales(query: SalesQuery): {
    data: SaleRecord[];
    totalPages: number;
    currentPage: number;
  } {
    let filtered = [...this.salesData];

    // Apply search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.customerName.toLowerCase().includes(searchLower) ||
          record.phoneNumber.includes(searchLower)
      );
    }

    // Apply filters
    if (query.filters) {
      filtered = this.applyFilters(filtered, query.filters);
    }

    // Apply sorting
    filtered = this.applySorting(filtered, query.field);

    // Apply pagination
    const totalPages = Math.ceil(filtered.length / query.pageSize);
    const currentPage = Math.max(1, Math.min(query.page, totalPages || 1));
    const startIndex = (currentPage - 1) * query.pageSize;
    const endIndex = startIndex + query.pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalPages: totalPages || 1,
      currentPage,
    };
  }

  private applyFilters(data: SaleRecord[], filters: FilterOptions): SaleRecord[] {
    let filtered = data;

    // Region filter
    if (filters.region && filters.region.length > 0) {
      filtered = filtered.filter((record) =>
        filters.region!.includes(record.customerRegion)
      );
    }

    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      filtered = filtered.filter((record) =>
        filters.gender!.includes(record.gender)
      );
    }

    // Age range filter
    if (filters.ageRange) {
      const { min, max } = filters.ageRange;
      if (min !== undefined) {
        filtered = filtered.filter((record) => record.age >= min);
      }
      if (max !== undefined) {
        filtered = filtered.filter((record) => record.age <= max);
      }
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter((record) =>
        filters.category!.includes(record.productCategory)
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((record) => {
        const recordTags = record.tags
          .toLowerCase()
          .split(',')
          .map((tag) => tag.trim());
        return filters.tags!.some((filterTag: string) =>
          recordTags.includes(filterTag.toLowerCase())
        );
      });
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      filtered = filtered.filter((record) =>
        filters.paymentMethod!.includes(record.paymentMethod)
      );
    }

    // Date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start) {
        filtered = filtered.filter(
          (record) => record.date >= start
        );
      }
      if (end) {
        filtered = filtered.filter(
          (record) => record.date <= end
        );
      }
    }

    return filtered;
  }

  private applySorting(data: SaleRecord[], sortField: SortField): SaleRecord[] {
    const sorted = [...data];

    switch (sortField) {
      case SortField.DATE_DESC:
        sorted.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA; // Descending
        });
        break;

      case SortField.QUANTITY:
        sorted.sort((a, b) => b.quantity - a.quantity); // Descending
        break;

      case SortField.CUSTOMER_NAME_ASC:
        sorted.sort((a, b) =>
          a.customerName.localeCompare(b.customerName)
        );
        break;

      default:
        // Default to date desc
        sorted.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
    }

    return sorted;
  }

  // Helper methods to get unique values for filters
  getUniqueRegions(): string[] {
    const regions = new Set(this.salesData.map((r) => r.customerRegion));
    return Array.from(regions).sort();
  }

  getUniqueGenders(): string[] {
    const genders = new Set(this.salesData.map((r) => r.gender));
    return Array.from(genders).sort();
  }

  getUniqueCategories(): string[] {
    const categories = new Set(this.salesData.map((r) => r.productCategory));
    return Array.from(categories).sort();
  }

  getUniquePaymentMethods(): string[] {
    const methods = new Set(this.salesData.map((r) => r.paymentMethod));
    return Array.from(methods).sort();
  }

  getUniqueTags(): string[] {
    const allTags = new Set<string>();
    this.salesData.forEach((record) => {
      record.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .forEach((tag: string) => {
          if (tag) allTags.add(tag);
        });
    });
    return Array.from(allTags).sort();
  }

  getAgeRange(): { min: number; max: number } {
    if (this.salesData.length === 0) {
      return { min: 0, max: 0 };
    }
    
    let min = this.salesData[0].age;
    let max = this.salesData[0].age;
    
    for (let i = 1; i < this.salesData.length; i++) {
      const age = this.salesData[i].age;
      if (age < min) min = age;
      if (age > max) max = age;
    }
    
    return { min, max };
  }

  getDateRange(): { start: string; end: string } {
    const validDates = this.salesData
      .map((r) => r.date)
      .filter((d) => d && d.trim() !== '');
    
    if (validDates.length === 0) {
      return { start: '', end: '' };
    }
    
    let start = validDates[0];
    let end = validDates[0];
    
    for (let i = 1; i < validDates.length; i++) {
      const date = validDates[i];
      if (date < start) start = date;
      if (date > end) end = date;
    }
    
    return { start, end };
  }
}

