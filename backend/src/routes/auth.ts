import { Router } from 'express';
import { signIn, signUp, refreshTokenHandler, getMe } from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/sign-in', signIn);
router.post('/sign-up', signUp);
router.post('/refresh', refreshTokenHandler);
router.get('/me', authMiddleware, getMe);

export default router;
