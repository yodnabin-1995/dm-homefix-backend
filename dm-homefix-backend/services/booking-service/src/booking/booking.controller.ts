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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private svc: BookingService) {}

  @Post()
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Create a booking request' })
  create(@Request() req: { user: { sub: string; role: string } }, @Body() dto: CreateBookingDto) {
    return this.svc.create(req.user.sub, dto);
  }

  @Get()
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'List my bookings' })
  findAll(@Request() req: { user: { sub: string; role: string } }) {
    return this.svc.findAll(req.user.sub);
  }

  @Get('admin')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin: list all bookings' })
  adminList() {
    return this.svc.adminList();
  }

  @Get(':id')
  @Roles('CUSTOMER', 'ADMIN', 'TECHNICIAN')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string; role: string } },
  ) {
    return this.svc.findOne(id, req.user.sub, req.user.role);
  }

  @Patch(':id/cancel')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string; role: string } },
  ) {
    return this.svc.cancel(id, req.user.sub);
  }

  @Patch(':id/assign/:technicianId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin: assign verified technician' })
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('technicianId', ParseUUIDPipe) tid: string,
  ) {
    return this.svc.assignTechnician(id, tid);
  }
}
