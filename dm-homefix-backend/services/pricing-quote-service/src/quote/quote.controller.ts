import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('quotes') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('quotes')
export class QuoteController {
  constructor(private svc: QuoteService) {}

  @Post() @Roles('TECHNICIAN') @ApiOperation({ summary: 'Technician: submit a quote' })
  create(@Request() req: any, @Body() dto: CreateQuoteDto) { return this.svc.createQuote(req.user.sub, dto); }

  @Get('booking/:bookingId') @Roles('CUSTOMER','ADMIN','TECHNICIAN') @ApiOperation({ summary: 'Get quotes for a booking' })
  forBooking(@Param('bookingId', ParseUUIDPipe) id: string) { return this.svc.getQuotesForBooking(id); }

  @Get(':id') @Roles('CUSTOMER','ADMIN','TECHNICIAN') @ApiOperation({ summary: 'Get quote by ID' })
  getOne(@Param('id', ParseUUIDPipe) id: string) { return this.svc.getQuote(id); }

  @Patch(':id/accept') @Roles('CUSTOMER') @ApiOperation({ summary: 'Customer: accept a quote' })
  accept(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) { return this.svc.acceptQuote(id, req.user.sub); }

  @Patch(':id/decline') @Roles('CUSTOMER') @ApiOperation({ summary: 'Customer: decline a quote' })
  decline(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) { return this.svc.declineQuote(id, req.user.sub); }
}
