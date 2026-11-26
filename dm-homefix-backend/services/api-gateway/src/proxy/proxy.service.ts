import { Injectable, BadGatewayException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  private readonly serviceMap: Record<string, string>;

  constructor(private http: HttpService, private config: ConfigService) {
    this.serviceMap = {
      accounts:      config.get('ACCOUNT_SERVICE_URL')!,
      verification:  config.get('TECHNICIAN_VERIFICATION_SERVICE_URL')!,
      catalog:       config.get('SERVICE_CATALOG_SERVICE_URL')!,
      bookings:      config.get('BOOKING_SERVICE_URL')!,
      quotes:        config.get('PRICING_QUOTE_SERVICE_URL')!,
      jobs:          config.get('JOB_MANAGEMENT_SERVICE_URL')!,
      payments:      config.get('PAYMENT_SERVICE_URL')!,
      reviews:       config.get('REVIEW_COMPLAINT_SERVICE_URL')!,
      notifications: config.get('NOTIFICATION_SERVICE_URL')!,
    };
  }

  async forward(service: string, req: Request) {
    const base = this.serviceMap[service];
    if (!base) throw new BadGatewayException(`Unknown service: ${service}`);

    const url = `${base}${req.url}`;
    const correlationId = req.headers['x-correlation-id'] as string;

    const axiosConfig: AxiosRequestConfig = {
      method: req.method as any,
      url,
      headers: {
        ...(req.headers as Record<string, string>),
        host: undefined as any,
        'x-correlation-id': correlationId,
      },
      data: req.body,
      validateStatus: () => true,
    };

    try {
      const response = await firstValueFrom(this.http.request(axiosConfig));
      return { status: response.status, data: response.data };
    } catch (err) {
      this.logger.error(`Proxy error forwarding to ${service}: ${err}`);
      throw new BadGatewayException('Service unavailable');
    }
  }
}
