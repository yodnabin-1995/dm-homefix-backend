import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { STORAGE_BUCKETS } from './storage.config';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client;
  private readonly region: string;

  constructor(private config: ConfigService) {
    this.region = config.get<string>('MINIO_REGION', 'us-east-1');
    this.client = new Minio.Client({
      endPoint: config.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(config.get<string>('MINIO_PORT', '9000'), 10),
      useSSL: config.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: config.get<string>('MINIO_ACCESS_KEY', 'dmhomefix'),
      secretKey: config.get<string>('MINIO_SECRET_KEY', 'dmhomefix_dev'),
    });
  }

  async onModuleInit() {
    await this.ensureBuckets();
  }

  private async ensureBuckets() {
    for (const bucket of Object.values(STORAGE_BUCKETS)) {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket, this.region);
        this.logger.log(`Created MinIO bucket: ${bucket}`);

        // verification-docs bucket: block all public access
        if (bucket === STORAGE_BUCKETS.VERIFICATION_DOCS) {
          await this.client.setBucketPolicy(
            bucket,
            JSON.stringify({
              Version: '2012-10-17',
              Statement: [],  // deny all anonymous access
            }),
          );
        }

        // profile-images bucket: allow public read
        if (bucket === STORAGE_BUCKETS.PROFILE_IMAGES) {
          await this.client.setBucketPolicy(
            bucket,
            JSON.stringify({
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Principal: { AWS: ['*'] },
                  Action: ['s3:GetObject'],
                  Resource: [`arn:aws:s3:::${bucket}/*`],
                },
              ],
            }),
          );
        }
      }
    }
    this.logger.log('MinIO buckets ready');
  }

  /**
   * Upload a file buffer to a bucket.
   * Returns the object key (path inside the bucket).
   */
  async uploadFile(
    bucket: string,
    objectKey: string,
    buffer: Buffer,
    mimeType: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    await this.client.putObject(bucket, objectKey, buffer, buffer.length, {
      'Content-Type': mimeType,
      ...metadata,
    });
    this.logger.log(`Uploaded to ${bucket}/${objectKey}`);
    return objectKey;
  }

  /**
   * Generate a pre-signed URL valid for the given number of seconds.
   * Use for private buckets (e.g. verification documents).
   */
  async getPresignedUrl(
    bucket: string,
    objectKey: string,
    expirySeconds = 3600,
  ): Promise<string> {
    return this.client.presignedGetObject(bucket, objectKey, expirySeconds);
  }

  /**
   * Delete a file from a bucket.
   */
  async deleteFile(bucket: string, objectKey: string): Promise<void> {
    await this.client.removeObject(bucket, objectKey);
    this.logger.log(`Deleted ${bucket}/${objectKey}`);
  }

  /**
   * Check if an object exists.
   */
  async fileExists(bucket: string, objectKey: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, objectKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Direct public URL (only works for public buckets like profile-images).
   */
  getPublicUrl(bucket: string, objectKey: string): string {
    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.config.get<string>('MINIO_PORT', '9000');
    const ssl = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const proto = ssl ? 'https' : 'http';
    return `${proto}://${endpoint}:${port}/${bucket}/${objectKey}`;
  }
}
