import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectToDatabase } from '../src/utils/database.js';
import salesRoutes from '../src/routes/salesRoutes.js';
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Health check endpoint (NO database connection needed - fast response)
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Initialize MongoDB connection (cached across invocations)
let isConnected = false;
async function ensureDatabaseConnection() {
    if (!isConnected) {
        try {
            await connectToDatabase();
            isConnected = true;
            console.log('✅ MongoDB connection established');
        }
        catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }
}
// Middleware to ensure DB connection ONLY for API routes that need it
app.use('/api', async (_req, _res, next) => {
    try {
        await ensureDatabaseConnection();
        next();
    }
    catch (error) {
        console.error('Database connection error:', error);
        if (!_res.headersSent) {
            _res.status(500).json({ error: 'Database connection failed' });
        }
    }
});
// API routes (these will use the DB connection middleware above)
app.use('/api/sales', salesRoutes);
// Error handler
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});
// 404 handler
app.use((_req, res) => {
    if (!res.headersSent) {
        res.status(404).json({ error: 'Not found' });
    }
});
// Export serverless handler
export default serverless(app);
//# sourceMappingURL=index.js.map