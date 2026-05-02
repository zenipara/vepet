import { Router } from 'express';
import { getAll, getById, create, update, delete_ } from '../controllers/crud.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const tableRoutes = [
  { path: 'pets', tableName: 'pets' },
  { path: 'services', tableName: 'services' },
  { path: 'doctors', tableName: 'doctors' },
  { path: 'appointments', tableName: 'appointments' },
  { path: 'bookings', tableName: 'appointments' },
  { path: 'medical_records', tableName: 'medical_records' },
] as const;

for (const { path, tableName } of tableRoutes) {
  router.get(`/${path}`, authMiddleware, getAll(tableName));
  router.get(`/${path}/:id`, authMiddleware, getById(tableName));
  router.post(`/${path}`, authMiddleware, create(tableName));
  router.put(`/${path}/:id`, authMiddleware, update(tableName));
  router.delete(`/${path}/:id`, authMiddleware, delete_(tableName));
}

export default router;
