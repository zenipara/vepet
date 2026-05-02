import { Router } from 'express';
import { handleRpc } from '../controllers/rpc.js';

const router = Router();

// POST /api/rpc/:name
router.post('/:name', handleRpc);

export default router;
