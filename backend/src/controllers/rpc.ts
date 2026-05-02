import { Response } from 'express';
import { query } from '../utils/db.js';
import { AuthRequest } from '../middleware/auth.js';

// Simple RPC controller. For now implement `min_stock` and allow extension.
export async function handleRpc(req: AuthRequest, res: Response) {
  try {
    const { name } = req.params;

    // Public read-only RPCs can be executed without auth in future
    if (name === 'min_stock') {
      // Return configured min_stock or default 10
      const minStock = Number(process.env.MIN_STOCK || 10);
      return res.json({ result: minStock });
    }

    // Example: allow calling named SQL functions (careful: validate in production)
    // If function exists, call it with optional params provided in body.params
    const params = req.body?.params || [];
    // Build a parameter placeholder list
    const placeholders = params.map((_: any, i: number) => `$${i + 1}`).join(',');
    const sql = `SELECT * FROM ${name}(${placeholders})`;

    const result = await query(sql, params);
    return res.json({ result: result.rows });
  } catch (error) {
    console.error('RPC error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default { handleRpc };
