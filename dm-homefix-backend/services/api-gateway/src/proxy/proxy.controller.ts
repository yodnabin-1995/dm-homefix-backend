import { All, Controller, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('proxy')
@Controller(':service')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @All('*')
  async proxy(@Param('service') service: string, @Req() req: Request, @Res() res: Response) {
    const { status, data } = await this.proxyService.forward(service, req);
    res.status(status).json(data);
  }
}
