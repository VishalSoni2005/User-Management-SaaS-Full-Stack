/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import pino from 'pino';
import { multistream } from 'pino-multi-stream';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    const logFilePath = path.join(
      logDir,
      `logs-${new Date().toISOString().split('T')[0]}.log`,
    );

    const streams = multistream([
      {
        stream: pino.transport({
          target: 'pino-pretty',
          options: { colorize: true },
        }),
      },
      { stream: fs.createWriteStream(logFilePath, { flags: 'a' }) },
    ]);

    this.logger = pino(
      {
        level: process.env.LOG_LEVEL || 'trace',
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      streams,
    );
  }

  info(message: string, context?: string, trace?: string) {
    this.logger.info(
      `[INFO] ${message} ${context !== undefined ? context : ''} ${trace !== undefined ? trace : ''}`,
    );
  }

  log(message: string, context?: string, trace?: string) {
    this.logger.info(
      `[LOG] ${message} ${context !== undefined ? context : ''} ${trace !== undefined ? trace : ''}`,
    );
  }

  error(message: string, trace?: string) {
    this.logger.error(`[ERROR] ${message} ${trace !== undefined ? trace : ''}`);
  }

  warn(message: string, trace?: string, context?: string) {
    this.logger.warn(
      `[WARN] ${message} ${trace !== undefined ? trace : ''} ${context !== undefined ? context : ''}`,
    );
  }

  debug(message: string, context?: string, trace?: string) {
    this.logger.debug(
      `[DEBUG] ${message} ${context !== undefined ? context : ''} ${trace !== undefined ? trace : ''}`,
    );
  }

  verbose(message: string, context?: string, trace?: string) {
    this.logger.trace(
      `[VERBOSE] ${message} ${context !== undefined ? context : ''} ${trace !== undefined ? trace : ''}`,
    );
  }
}
