import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

export const STORAGE_BUCKETS = {
  VERIFICATION_DOCS: 'verification-docs',
  PROFILE_IMAGES: 'profile-images',
} as const;

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
    try {
      await this.ensureBuckets();
    } catch (err) {
      this.logger.warn(
        `MinIO not reachable on startup — buckets will be created on first use. Error: ${err}`,
      );
    }
  }

  private async ensureBuckets() {
    for (const bucket of Object.values(STORAGE_BUCKETS)) {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket, this.region);
        this.logger.log(`Created MinIO bucket: ${bucket}`);
      }
    }
    this.logger.log('MinIO buckets ready');
  }

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
    return objectKey;
  }

  async getPresignedUrl(bucket: string, objectKey: string, expirySeconds = 3600): Promise<string> {
    return this.client.presignedGetObject(bucket, objectKey, expirySeconds);
  }

  async deleteFile(bucket: string, objectKey: string): Promise<void> {
    await this.client.removeObject(bucket, objectKey);
  }

  async fileExists(bucket: string, objectKey: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, objectKey);
      return true;
    } catch {
      return false;
    }
  }
}
