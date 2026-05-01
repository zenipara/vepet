import { Router } from 'express';
import { getAll, getById, create, update, delete_ } from '../controllers/crud.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Generic CRUD routes for common tables
const tables = ['pets', 'bookings', 'services', 'doctors', 'appointments', 'medical_records'];

for (const table of tables) {
  // Protected routes - require authentication
  router.get(`/${table}`, authMiddleware, await getAll(table));
  router.get(`/${table}/:id`, authMiddleware, await getById(table));
  router.post(`/${table}`, authMiddleware, await create(table));
  router.put(`/${table}/:id`, authMiddleware, await update(table));
  router.delete(`/${table}/:id`, authMiddleware, await delete_(table));
}

export default router;
