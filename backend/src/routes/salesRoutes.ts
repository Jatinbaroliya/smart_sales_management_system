import { Router } from 'express';
import { SalesController } from '../controllers/salesController.js';
import { SalesService } from '../services/salesService.js';

const router = Router();

// Initialize service and controller
const salesService = new SalesService();
const salesController = new SalesController(salesService);

// Export service instance so it can be initialized with data
export { salesService };

// Routes
router.get('/', salesController.getSales);
router.get('/filter-options', salesController.getFilterOptions);

export default router;

