import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  private format(level: string, message: string, meta?: object): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...meta,
    });
  }

  log(message: string, meta?: object) {
    console.log(this.format('info', message, meta));
  }

  error(message: string, trace?: string, meta?: object) {
    console.error(this.format('error', message, { trace, ...meta }));
  }

  warn(message: string, meta?: object) {
    console.warn(this.format('warn', message, meta));
  }

  debug(message: string, meta?: object) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.format('debug', message, meta));
    }
  }
}
