// src/app-logger/app-logger.service.ts - Alternative Version
import { Injectable, Inject, Scope, Logger } from '@nestjs/common';
import type { LoggerOptions } from './app-logger.constants';
import { LOGGER_OPTIONS } from './app-logger.constants';
import { IAppLogger, LogLevel } from './app-logger.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements IAppLogger {
  private readonly logger: Logger;
  private context = 'AppLogger';

  constructor(@Inject(LOGGER_OPTIONS) private readonly options: LoggerOptions) {
    this.logger = new Logger(this.context);
    this.initializeFileTransports();
  }

  private logFileStream: fs.WriteStream;
  private errorFileStream: fs.WriteStream;

  private initializeFileTransports() {
    if (this.options.fileTransport) {
      const logsDir = path.join(process.cwd(), 'logs');

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      this.logFileStream = fs.createWriteStream(
        path.join(logsDir, this.options.logFile || 'app.log'),
        { flags: 'a' },
      );
      this.errorFileStream = fs.createWriteStream(
        path.join(logsDir, this.options.errorFile || 'error.log'),
        { flags: 'a' },
      );
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.LOG,
      LogLevel.DEBUG,
      LogLevel.VERBOSE,
    ];
    const currentLevelIndex = levels.indexOf(this.options.level as LogLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp =
      this.options.timestamp !== false ? new Date().toISOString() : '';
    const contextStr = context ? ` [${context}]` : '';
    return `${timestamp} ${level.toUpperCase()}${contextStr}: ${message}`;
  }

  private writeToFile(level: string, formattedMessage: string) {
    if (this.options.fileTransport) {
      const stream =
        level === 'error' ? this.errorFileStream : this.logFileStream;
      if (stream) {
        stream.write(formattedMessage + '\n');
      }
    }
  }

  log(message: string, context?: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.LOG)) return;

    const formattedMessage = this.formatMessage(
      'log',
      message,
      context || this.context,
    );
    this.logger.log(formattedMessage);
    this.writeToFile('log', formattedMessage);
  }

  error(message: string, trace?: string, context?: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const formattedMessage = this.formatMessage(
      'error',
      message,
      context || this.context,
    );
    const fullMessage = trace
      ? `${formattedMessage}\nTrace: ${trace}`
      : formattedMessage;

    this.logger.error(fullMessage);
    this.writeToFile('error', fullMessage);
  }

  warn(message: string, context?: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const formattedMessage = this.formatMessage(
      'warn',
      message,
      context || this.context,
    );
    this.logger.warn(formattedMessage);
    this.writeToFile('warn', formattedMessage);
  }

  debug(message: string, context?: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const formattedMessage = this.formatMessage(
      'debug',
      message,
      context || this.context,
    );
    this.logger.debug(formattedMessage);
    this.writeToFile('debug', formattedMessage);
  }

  verbose(message: string, context?: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.VERBOSE)) return;

    const formattedMessage = this.formatMessage(
      'verbose',
      message,
      context || this.context,
    );
    this.logger.verbose(formattedMessage);
    this.writeToFile('verbose', formattedMessage);
  }

  setContext(context: string) {
    this.context = context;
    return this;
  }

  onApplicationShutdown() {
    if (this.logFileStream) {
      this.logFileStream.end();
    }
    if (this.errorFileStream) {
      this.errorFileStream.end();
    }
  }
}
