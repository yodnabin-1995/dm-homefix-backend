import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private svc: PaymentService) {}

  @Post() @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('CUSTOMER','ADMIN')
  @ApiOperation({ summary: 'Initiate a payment' })
  initiate(@Body() dto: InitiatePaymentDto) { return this.svc.initiate(dto); }

  @Get('booking/:bookingId') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('CUSTOMER','ADMIN','TECHNICIAN')
  @ApiOperation({ summary: 'Get payments for a booking' })
  byBooking(@Param('bookingId', ParseUUIDPipe) id: string) { return this.svc.getByBooking(id); }

  @Get(':id') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN','CUSTOMER')
  @ApiOperation({ summary: 'Get payment by ID' })
  getOne(@Param('id', ParseUUIDPipe) id: string) { return this.svc.getOne(id); }

  @Post('webhook') @ApiOperation({ summary: 'Payment provider webhook (no auth — provider calls this)' })
  webhook(@Body() body: unknown) { return this.svc.handleWebhook(body); }
}
