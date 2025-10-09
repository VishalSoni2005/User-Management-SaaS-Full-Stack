import { Controller } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';

@Controller('app-logger')
export class AppLoggerController {
  constructor(private readonly appLoggerService: AppLoggerService) {}
}
