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
  { path: 'products', tableName: 'products' },
  { path: 'batches', tableName: 'batches' },
  { path: 'stock_movements', tableName: 'stock_movements' },
  { path: 'notifications', tableName: 'notifications' },
  { path: 'profiles', tableName: 'profiles' },
  { path: 'vendors', tableName: 'vendors' },
  { path: 'treatments', tableName: 'treatments' },
  { path: 'prescriptions', tableName: 'prescriptions' },
  { path: 'inpatient_cases', tableName: 'inpatient_cases' },
  { path: 'case_updates', tableName: 'case_updates' },
  { path: 'case_photos', tableName: 'case_photos' },
  { path: 'clinic_profile', tableName: 'clinic_profile' },
  { path: 'public_pages', tableName: 'public_pages' },
  { path: 'feature_flags', tableName: 'feature_flags' },
  { path: 'blog_posts', tableName: 'blog_posts' },
  { path: 'testimonials', tableName: 'testimonials' },
] as const;

for (const { path, tableName } of tableRoutes) {
  router.get(`/${path}`, authMiddleware, getAll(tableName));
  router.get(`/${path}/:id`, authMiddleware, getById(tableName));
  router.post(`/${path}`, authMiddleware, create(tableName));
  router.put(`/${path}/:id`, authMiddleware, update(tableName));
  router.delete(`/${path}/:id`, authMiddleware, delete_(tableName));
}

export default router;
