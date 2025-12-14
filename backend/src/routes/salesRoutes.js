import { Router } from 'express';
import { SalesController } from '../controllers/salesController.ts';
import { SalesService } from '../services/salesService.ts';
const router = Router();
// Initialize service and controller
const salesService = new SalesService();
const salesController = new SalesController(salesService);
// Routes
router.get('/', salesController.getSales);
router.get('/filter-options', salesController.getFilterOptions);
export default router;
//# sourceMappingURL=salesRoutes.js.map