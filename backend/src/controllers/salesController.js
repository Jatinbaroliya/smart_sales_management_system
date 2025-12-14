import { SalesService } from '../services/salesService.js';
import { SortField } from '../models/SortOptions.js';
export class SalesController {
    salesService;
    constructor(salesService) {
        this.salesService = salesService;
    }
    getSales = async (req, res) => {
        try {
            // Parse query parameters
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const search = req.query.search || undefined;
            const sortField = req.query.sort || SortField.DATE_DESC;
            // Parse filters from query string
            const filters = {};
            if (req.query.region) {
                filters.region = Array.isArray(req.query.region)
                    ? req.query.region
                    : [req.query.region];
            }
            if (req.query.gender) {
                filters.gender = Array.isArray(req.query.gender)
                    ? req.query.gender
                    : [req.query.gender];
            }
            if (req.query.ageMin) {
                filters.ageRange = {
                    ...filters.ageRange,
                    min: parseInt(req.query.ageMin, 10),
                };
            }
            if (req.query.ageMax) {
                filters.ageRange = {
                    ...filters.ageRange,
                    max: parseInt(req.query.ageMax, 10),
                };
            }
            if (req.query.category) {
                filters.category = Array.isArray(req.query.category)
                    ? req.query.category
                    : [req.query.category];
            }
            if (req.query.tags) {
                filters.tags = Array.isArray(req.query.tags)
                    ? req.query.tags
                    : [req.query.tags];
            }
            if (req.query.paymentMethod) {
                filters.paymentMethod = Array.isArray(req.query.paymentMethod)
                    ? req.query.paymentMethod
                    : [req.query.paymentMethod];
            }
            if (req.query.dateStart) {
                filters.dateRange = {
                    ...filters.dateRange,
                    start: req.query.dateStart,
                };
            }
            if (req.query.dateEnd) {
                filters.dateRange = {
                    ...filters.dateRange,
                    end: req.query.dateEnd,
                };
            }
            const query = {
                page,
                pageSize,
                ...(search ? { search } : {}),
                field: sortField,
                ...(Object.keys(filters).length > 0 ? { filters } : {}),
            };
            const result = await this.salesService.getSales(query);
            const response = {
                data: result.data,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching sales:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    getFilterOptions = async (_req, res) => {
        try {
            const [regions, genders, categories, paymentMethods, tags, ageRange, dateRange,] = await Promise.all([
                this.salesService.getUniqueRegions(),
                this.salesService.getUniqueGenders(),
                this.salesService.getUniqueCategories(),
                this.salesService.getUniquePaymentMethods(),
                this.salesService.getUniqueTags(),
                this.salesService.getAgeRange(),
                this.salesService.getDateRange(),
            ]);
            res.json({
                regions,
                genders,
                categories,
                paymentMethods,
                tags,
                ageRange,
                dateRange,
            });
        }
        catch (error) {
            console.error('Error fetching filter options:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
//# sourceMappingURL=salesController.js.map