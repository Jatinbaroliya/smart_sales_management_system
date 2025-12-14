import type { SaleRecord } from '../models/SaleRecord.js';
import type { SalesQuery } from '../models/SalesQuery.js';
export declare class SalesService {
    getSales(query: SalesQuery): Promise<{
        data: SaleRecord[];
        totalPages: number;
        currentPage: number;
    }>;
    private buildFilterQuery;
    private buildSortObject;
    private convertToSaleRecord;
    getUniqueRegions(): Promise<string[]>;
    getUniqueGenders(): Promise<string[]>;
    getUniqueCategories(): Promise<string[]>;
    getUniquePaymentMethods(): Promise<string[]>;
    getUniqueTags(): Promise<string[]>;
    getAgeRange(): Promise<{
        min: number;
        max: number;
    }>;
    getDateRange(): Promise<{
        start: string;
        end: string;
    }>;
}
//# sourceMappingURL=salesService.d.ts.map