import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewDecisionDto } from './dto/review-decision.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

// ── Authenticated routes (require JWT) ───────────────────────────────────────
@ApiTags('verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('verification')
export class VerificationController {
  constructor(private svc: VerificationService) {}

  @Post('applications')
  @Roles('TECHNICIAN')
  @ApiOperation({ summary: 'Create a draft verification application' })
  create(
    @Request() req: { user: { sub: string; role: string } },
    @Body() dto: CreateApplicationDto,
  ) {
    return this.svc.createApplication(req.user.sub, dto);
  }

  @Post('applications/:id/submit')
  @Roles('TECHNICIAN')
  @ApiOperation({ summary: 'Submit draft application for admin review' })
  submit(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string; role: string } },
  ) {
    return this.svc.submitApplication(id, req.user.sub);
  }

  @Patch('applications/:id/resubmit')
  @Roles('TECHNICIAN')
  @ApiOperation({ summary: 'Resubmit application after information was requested' })
  resubmit(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string; role: string } },
    @Body() dto: CreateApplicationDto,
  ) {
    return this.svc.resubmitApplication(id, req.user.sub, dto);
  }

  @Get('applications/my')
  @Roles('TECHNICIAN')
  @ApiOperation({ summary: 'Technician: get my verification applications' })
  mine(@Request() req: { user: { sub: string; role: string } }) {
    return this.svc.getMyApplications(req.user.sub);
  }

  @Get('applications/pending')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin: list all PENDING_REVIEW applications' })
  pending() {
    return this.svc.listPending();
  }

  @Get('applications/:id')
  @Roles('TECHNICIAN', 'ADMIN')
  @ApiOperation({ summary: 'Get a specific application by ID' })
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getApplication(id);
  }

  @Post('applications/:id/review')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin: approve, reject or request more information' })
  review(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string; role: string } },
    @Body() dto: ReviewDecisionDto,
  ) {
    return this.svc.reviewApplication(id, req.user.sub, dto);
  }
}

// ── Internal / public route (no JWT — called by other services) ───────────────
@ApiTags('verification')
@Controller('verification')
export class EligibilityController {
  constructor(private svc: VerificationService) {}

  @Get('eligibility/:technicianId')
  @ApiOperation({
    summary: 'Check if a technician is approved and eligible to receive bookings',
    description:
      'Public internal endpoint. Called by Booking Service before assigning a technician. ' +
      'Returns `{ eligible: boolean, status: string }`.',
  })
  eligibility(@Param('technicianId', ParseUUIDPipe) id: string) {
    return this.svc.checkEligibility(id);
  }
}
