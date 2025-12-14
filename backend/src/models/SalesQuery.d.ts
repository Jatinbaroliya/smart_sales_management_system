import type { FilterOptions } from './FilterOptions.ts';
import type { PaginationParams } from './PaginationParams.ts';
import type { SortOptions } from './SortOptions.ts';
export interface SalesQuery extends PaginationParams, SortOptions {
    search?: string;
    filters?: FilterOptions;
}
//# sourceMappingURL=SalesQuery.d.ts.map