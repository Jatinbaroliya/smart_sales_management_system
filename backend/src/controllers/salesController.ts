import type { Request, Response } from 'express';
import { SalesService } from '../services/salesService.js';
import type { SalesQuery } from '../models/SalesQuery.js';
import { SortField } from '../models/SortOptions.js';
import type { APIResponse } from '../models/APIResponse.js';
import type { SaleRecord } from '../models/SaleRecord.js';

export class SalesController {
  constructor(private salesService: SalesService) {}

  getSales = async (req: Request, res: Response): Promise<void> => {
    try {
      // Parse query parameters
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const search = (req.query.search as string) || undefined;
      const sortField =
        (req.query.sort as string) || SortField.DATE_DESC;

      // Parse filters from query string
      const filters: {
        region?: string[];
        gender?: string[];
        ageRange?: { min?: number; max?: number };
        category?: string[];
        tags?: string[];
        paymentMethod?: string[];
        dateRange?: { start?: string; end?: string };
      } = {};

      if (req.query.region) {
        filters.region = Array.isArray(req.query.region)
          ? (req.query.region as string[])
          : [req.query.region as string];
      }

      if (req.query.gender) {
        filters.gender = Array.isArray(req.query.gender)
          ? (req.query.gender as string[])
          : [req.query.gender as string];
      }

      if (req.query.ageMin) {
        filters.ageRange = {
          ...filters.ageRange,
          min: parseInt(req.query.ageMin as string, 10),
        };
      }

      if (req.query.ageMax) {
        filters.ageRange = {
          ...filters.ageRange,
          max: parseInt(req.query.ageMax as string, 10),
        };
      }

      if (req.query.category) {
        filters.category = Array.isArray(req.query.category)
          ? (req.query.category as string[])
          : [req.query.category as string];
      }

      if (req.query.tags) {
        filters.tags = Array.isArray(req.query.tags)
          ? (req.query.tags as string[])
          : [req.query.tags as string];
      }

      if (req.query.paymentMethod) {
        filters.paymentMethod = Array.isArray(req.query.paymentMethod)
          ? (req.query.paymentMethod as string[])
          : [req.query.paymentMethod as string];
      }

      if (req.query.dateStart) {
        filters.dateRange = {
          ...filters.dateRange,
          start: req.query.dateStart as string,
        };
      }

      if (req.query.dateEnd) {
        filters.dateRange = {
          ...filters.dateRange,
          end: req.query.dateEnd as string,
        };
      }

      const query: SalesQuery = {
        page,
        pageSize,
        ...(search ? { search } : {}),
        field: sortField as SortField,
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
      };

      const result = await this.salesService.getSales(query);

      const response: APIResponse<SaleRecord[]> = {
        data: result.data,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getFilterOptions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const [
        regions,
        genders,
        categories,
        paymentMethods,
        tags,
        ageRange,
        dateRange,
      ] = await Promise.all([
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
    } catch (error) {
      console.error('Error fetching filter options:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

