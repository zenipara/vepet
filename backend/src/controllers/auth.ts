import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../utils/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/auth.js';

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  full_name: string;
}

export async function signIn(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body as SignInPayload;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Simple query to get user by email (assumes users table exists)
    const result = await query(
      `SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'User account is inactive' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const payload: TokenPayload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function signUp(req: AuthRequest, res: Response) {
  try {
    const { email, password, full_name } = req.body as SignUpPayload;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name required' });
    }

    // Check if user already exists
    const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, role, is_active) VALUES ($1, $2, $3, $4) RETURNING id, email, role`,
      [email, passwordHash, 'customer', true]
    );

    const user = result.rows[0];

    // Create profile
    await query(
      `INSERT INTO profiles (id, full_name, is_active) VALUES ($1, $2, $3)`,
      [user.id, full_name, true]
    );

    // Generate tokens
    const payload: TokenPayload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(201).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function refreshTokenHandler(req: AuthRequest, res: Response) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(refresh_token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(payload);

    return res.json({ access_token: accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await query(
      `SELECT id, email, role, is_active FROM users WHERE id = $1`,
      [req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    return res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
