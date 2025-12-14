import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './utils/database.js';
import salesRoutes from './routes/salesRoutes.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/sales', salesRoutes);
// Initialize MongoDB connection (cached across invocations)
let isConnected = false;
let connectionPromise = null;
async function ensureDatabaseConnection() {
    if (isConnected)
        return;
    if (connectionPromise)
        return connectionPromise;
    connectionPromise = (async () => {
        try {
            await connectToDatabase();
            isConnected = true;
            console.log('✅ MongoDB connection established');
        }
        catch (error) {
            console.error('❌ MongoDB connection error:', error);
            isConnected = false;
            connectionPromise = null;
            throw error;
        }
    })();
    return connectionPromise;
}
// Vercel serverless handler
export default async function handler(req, res) {
    const url = req.url || req.path || '';
    // allow health check without DB
    if (url === '/health' || url.startsWith('/health')) {
        return new Promise((resolve) => {
            app(req, res, () => {
                if (!res.headersSent)
                    res.status(404).json({ error: 'Not found' });
                resolve();
            });
        });
    }
    try {
        await ensureDatabaseConnection();
    }
    catch (error) {
        console.error('Database connection failed:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Database connection failed',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
        return;
    }
    return new Promise((resolve) => {
        const next = () => {
            if (!res.headersSent)
                res.status(404).json({ error: 'Not found' });
            resolve();
        };
        app(req, res, next);
    });
}
// Start standalone server locally
async function startServer() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await ensureDatabaseConnection();
        if (process.env.NODE_ENV === 'production') {
            console.log('Production environment detected; not starting standalone server.');
            return app;
        }
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
if (process.env.VERCEL === undefined)
    startServer();
//# sourceMappingURL=index.js.map