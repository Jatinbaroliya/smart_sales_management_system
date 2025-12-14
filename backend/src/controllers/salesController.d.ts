import type { Request, Response } from 'express';
import { SalesService } from '../services/salesService.js';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    getSales: (req: Request, res: Response) => Promise<void>;
    getFilterOptions: (_req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=salesController.d.ts.map