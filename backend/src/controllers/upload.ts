import { Response } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import { AuthRequest } from '../middleware/auth.js';

dotenv.config();

const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY || '',
  },
  endpoint: process.env.R2_ENDPOINT || '',
});

/**
 * Generate a signed URL for direct upload to R2
 * Frontend will use this URL to upload file directly to R2
 */
export async function getSignedUploadUrl(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { filename, content_type } = req.body;

    if (!filename || !content_type) {
      return res.status(400).json({ error: 'Filename and content_type required' });
    }

    // Generate unique key with user_id and timestamp
    const key = `${req.user.user_id}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'vetcare-uploads',
      Key: key,
      ContentType: content_type,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return res.json({
      signed_url: signedUrl,
      url_expiry: 3600,
      object_key: key,
      public_url: `${process.env.R2_ENDPOINT}/${key}`,
    });
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Alternative: Server-side upload endpoint
 * Frontend POSTs file to this endpoint and we upload to R2
 */
export async function uploadFile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // This is a simplified version - in production, use multer for file handling
    const { file_content, filename, content_type } = req.body;

    if (!file_content || !filename) {
      return res.status(400).json({ error: 'File content and filename required' });
    }

    const key = `${req.user.user_id}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'vetcare-uploads',
      Key: key,
      Body: Buffer.from(file_content, 'base64'),
      ContentType: content_type || 'application/octet-stream',
    });

    await s3Client.send(command);

    return res.json({
      object_key: key,
      public_url: `${process.env.R2_ENDPOINT}/${key}`,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
