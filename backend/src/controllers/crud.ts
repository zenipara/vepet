import { Response } from 'express';
import { query } from '../utils/db.js';
import { AuthRequest } from '../middleware/auth.js';

/**
 * Generic CRUD controller for simple table operations
 * Usage: Map routes like /api/pets, /api/appointments to this controller
 */

export function getAll(tableName: string) {
  return async (req: AuthRequest, res: Response) => {
    try {
      const result = await query(`SELECT * FROM ${tableName} LIMIT 100`);
      return res.json({ data: result.rows });
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function getById(tableName: string) {
  return async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.json({ data: result.rows[0] });
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function create(tableName: string) {
  return async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body;

      // Build dynamic INSERT query
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(',');

      const result = await query(
        `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders}) RETURNING *`,
        values
      );

      return res.status(201).json({ data: result.rows[0] });
    } catch (error: any) {
      console.error(`Error creating ${tableName}:`, error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };
}

export function update(tableName: string) {
  return async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      // Build dynamic UPDATE query
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(',');

      const result = await query(
        `UPDATE ${tableName} SET ${setClause} WHERE id = $${columns.length + 1} RETURNING *`,
        [...values, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.json({ data: result.rows[0] });
    } catch (error: any) {
      console.error(`Error updating ${tableName}:`, error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };
}

export function delete_(tableName: string) {
  return async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
