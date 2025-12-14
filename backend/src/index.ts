import express from 'express';
import cors from 'cors';
import { loadSalesData } from './utils/csvParser.js';
import { salesService } from './routes/salesRoutes.js';
import salesRoutes from './routes/salesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/sales', salesRoutes);

// Initialize server
async function startServer() {
  try {
    console.log('Loading sales data from CSV...');
    const salesData = await loadSalesData();
    salesService.setSalesData(salesData);
    console.log(`Successfully loaded ${salesData.length} sales records`);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

