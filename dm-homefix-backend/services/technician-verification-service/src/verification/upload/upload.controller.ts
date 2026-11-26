import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StorageService, STORAGE_BUCKETS } from '../../storage/storage.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

@ApiTags('verification-documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('verification')
export class UploadController {
  constructor(private storage: StorageService) {}

  /**
   * Upload a verification document for an application.
   * Files land in the private MinIO bucket — never publicly accessible.
   * Returns a storage reference (objectKey) to store in the application.
   */
  @Post('applications/:id/documents')
  @Roles('TECHNICIAN')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a verification document (PDF or image, max 10 MB)' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_SIZE_BYTES } }))
  async uploadDocument(
    @Param('id', ParseUUIDPipe) applicationId: string,
    @Request() req: { user: { sub: string; role: string } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG and PDF files are allowed');
    }

    const ext = file.originalname.split('.').pop();
    const objectKey = `${req.user.sub}/${applicationId}/${uuidv4()}.${ext}`;

    await this.storage.uploadFile(
      STORAGE_BUCKETS.VERIFICATION_DOCS,
      objectKey,
      file.buffer,
      file.mimetype,
      { uploadedBy: req.user.sub, applicationId },
    );

    return {
      objectKey,
      bucket: STORAGE_BUCKETS.VERIFICATION_DOCS,
      message: 'Document uploaded. Add the objectKey to your application documentRefs.',
    };
  }

  /**
   * Get a short-lived pre-signed URL for a document.
   * Only the owning technician or an admin may request this.
   */
  @Post('documents/presign')
  @Roles('TECHNICIAN', 'ADMIN')
  @ApiOperation({ summary: 'Get a 1-hour pre-signed download URL for a document' })
  async presign(
    @Request() req: { user: { sub: string; role: string } },
    @Param('objectKey') objectKey: string,
  ) {
    const url = await this.storage.getPresignedUrl(
      STORAGE_BUCKETS.VERIFICATION_DOCS,
      objectKey,
      3600,
    );
    return { url, expiresInSeconds: 3600 };
  }
}
