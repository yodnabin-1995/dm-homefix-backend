import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

export const AVATAR_BUCKET = 'profile-images';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client;
  private readonly region: string;

  constructor(private config: ConfigService) {
    this.region = config.get<string>('MINIO_REGION', 'us-east-1');
    this.client = new Minio.Client({
      endPoint: config.get<string>('MINIO_ENDPOINT', 'minio'),
      port: parseInt(config.get<string>('MINIO_PORT', '9000'), 10),
      useSSL: config.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: config.get<string>('MINIO_ACCESS_KEY', 'dmhomefix'),
      secretKey: config.get<string>('MINIO_SECRET_KEY', 'dmhomefix_dev'),
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.client.bucketExists(AVATAR_BUCKET);
      if (!exists) {
        await this.client.makeBucket(AVATAR_BUCKET, this.region);
        await this.client.setBucketPolicy(
          AVATAR_BUCKET,
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${AVATAR_BUCKET}/*`],
              },
            ],
          }),
        );
        this.logger.log(`Created public bucket: ${AVATAR_BUCKET}`);
      }
    } catch (err) {
      this.logger.warn(`MinIO init warning: ${err}`);
    }
  }

  async uploadAvatar(accountId: string, buffer: Buffer, mimeType: string): Promise<string> {
    const ext = mimeType.split('/')[1] || 'jpg';
    const objectKey = `avatars/${accountId}.${ext}`;
    await this.client.putObject(AVATAR_BUCKET, objectKey, buffer, buffer.length, {
      'Content-Type': mimeType,
    });
    return objectKey;
  }

  getPublicUrl(objectKey: string): string {
    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'minio');
    const port = this.config.get<string>('MINIO_PORT', '9000');
    const ssl = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const proto = ssl ? 'https' : 'http';
    // For local dev, use localhost instead of the Docker service name
    const host = endpoint === 'minio' ? 'localhost' : endpoint;
    return `${proto}://${host}:${port}/${AVATAR_BUCKET}/${objectKey}`;
  }

  async deleteAvatar(objectKey: string): Promise<void> {
    try {
      await this.client.removeObject(AVATAR_BUCKET, objectKey);
    } catch {
      // ignore if not found
    }
  }
}
