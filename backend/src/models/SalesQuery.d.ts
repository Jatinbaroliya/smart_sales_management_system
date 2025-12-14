import type { FilterOptions } from './FilterOptions.js';
import type { PaginationParams } from './PaginationParams.js';
import type { SortOptions } from './SortOptions.js';
export interface SalesQuery extends PaginationParams, SortOptions {
    search?: string;
    filters?: FilterOptions;
}
//# sourceMappingURL=SalesQuery.d.ts.map