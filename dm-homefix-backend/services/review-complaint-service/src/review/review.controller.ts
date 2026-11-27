import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private svc: ReviewService) {}
  @Post()
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Submit a review after completed job' })
  create(@Req() req: { user: { sub: string; role: string } }, @Body() dto: CreateReviewDto) {
    return this.svc.create(req.user.sub, dto);
  }
  @Get('technician/:id')
  @ApiOperation({ summary: 'Get reviews for a technician' })
  forTechnician(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getForTechnician(id);
  }
  @Get('job/:id')
  @ApiOperation({ summary: 'Get reviews for a job' })
  forJob(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getForJob(id);
  }
}
