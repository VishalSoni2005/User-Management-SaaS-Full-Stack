/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import pino from 'pino';
import pretty from 'pino-pretty';
import { multistream } from 'pino-multi-stream';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: pino.Logger;
  private readonly serviceName = process.env.SERVICE_NAME || 'NestApp';
  private readonly env = process.env.NODE_ENV || 'development';

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    // Example: logs/2025-10-15.log
    const logFilePath = path.join(
      logDir,
      `${new Date().toISOString().split('T')[0]}.log`,
    );

    const fileStream = fs.createWriteStream(logFilePath, { flags: 'a' });

    const streams = multistream([
      {
        // Pretty print only for local/dev mode
        stream:
          this.env === 'development'
            ? pretty({
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              })
            : fileStream,
      },
      // Always log to file (structured JSON for production)
      { stream: fileStream },
    ]);

    this.logger = pino(
      {
        level:
          process.env.LOG_LEVEL ||
          (this.env === 'production' ? 'info' : 'debug'),
        base: { service: this.serviceName },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      streams,
    );
  }

  /**
   * Generic info log
   */
  log(message: string, context?: string) {
    this.logger.info({ context }, message);
  }

  /**
   * Informational logs (business logic, events, etc.)
   */
  info(message: string, context?: string) {
    this.logger.info({ context }, message);
  }

  /**
   * Warnings (non-fatal issues)
   */
  warn(message: string, context?: string) {
    this.logger.warn({ context }, message);
  }

  /**
   * Error logs (with optional trace/stack)
   */
  error(message: string, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  /**
   * Debugging logs (only visible in dev/test environments)
   */
  debug(message: string, context?: string) {
    if (this.env !== 'production') {
      this.logger.debug({ context }, message);
    }
  }

  /**
   * Verbose / low-level logs
   */
  verbose(message: string, context?: string) {
    if (this.env !== 'production') {
      this.logger.trace({ context }, message);
    }
  }
}
