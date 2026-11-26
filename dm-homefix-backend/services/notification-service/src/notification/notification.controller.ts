import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private svc: NotificationService) {}
  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin: send a notification' })
  send(@Body() dto: SendNotificationDto) {
    return this.svc.send(dto);
  }
  @Get('my')
  @ApiOperation({ summary: 'Get my notifications' })
  mine(@Request() req: { user: { sub: string; role: string } }) {
    return this.svc.getForRecipient(req.user.sub);
  }
}
