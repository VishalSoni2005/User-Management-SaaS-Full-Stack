export interface IAppLogger {
  log(message: string, context?: string, ...args: any[]): void;
  error(
    message: string,
    trace?: string,
    context?: string,
    ...args: any[]
  ): void;
  warn(message: string, context?: string, ...args: any[]): void;
  debug(message: string, context?: string, ...args: any[]): void;
  verbose(message: string, context?: string, ...args: any[]): void;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}
