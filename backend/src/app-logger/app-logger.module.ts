// src/common/logger/app-logger.module.ts
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { LOGGER_OPTIONS, LoggerOptions } from './app-logger.constants';

@Global()
@Module({})
export class AppLoggerModule {
  static forRoot(options: LoggerOptions = {}): DynamicModule {
    const loggerOptions: LoggerOptions = {
      level: options.level || 'log',
      timestamp: options.timestamp !== false,
      colorize: options.colorize !== false,
      fileTransport: options.fileTransport || false,
      logFile: options.logFile || 'app.log',
      errorFile: options.errorFile || 'error.log',
      ...options,
    };

    const loggerProvider: Provider = {
      provide: AppLoggerService,
      useFactory: () => new AppLoggerService(loggerOptions),
    };

    const optionsProvider: Provider = {
      provide: LOGGER_OPTIONS,
      useValue: loggerOptions,
    };

    return {
      module: AppLoggerModule,
      providers: [loggerProvider, optionsProvider],
      exports: [AppLoggerService],
    };
  }
}
