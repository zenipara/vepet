import express, { Express, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import crudRoutes from './routes/crud.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: CORS_ORIGIN.split(',') }));

// Health check
app.get('/health', (_, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', crudRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((_, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, _: any, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VetCare API Gateway running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`💾 CRUD endpoints: http://localhost:${PORT}/api/[table]`);
  console.log(`📤 Upload endpoints: http://localhost:${PORT}/api/upload`);
});

export default app;
