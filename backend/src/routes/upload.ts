import { Router } from 'express';
import { getSignedUploadUrl, uploadFile } from '../controllers/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get signed URL for direct R2 upload (client-side upload)
router.post('/signed-url', authMiddleware, getSignedUploadUrl);

// Server-side upload endpoint
router.post('/upload', authMiddleware, uploadFile);

export default router;
