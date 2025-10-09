export const APP_LOGGER = 'APP_LOGGER';
export const LOGGER_OPTIONS = 'LOGGER_OPTIONS';

export interface LoggerOptions {
  level?: string;
  timestamp?: boolean;
  colorize?: boolean;
  fileTransport?: boolean;
  logFile?: string;
  errorFile?: string;
}
