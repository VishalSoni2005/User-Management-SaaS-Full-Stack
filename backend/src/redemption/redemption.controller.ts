import { Controller } from '@nestjs/common';
import { RedemptionService } from './redemption.service';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}
}
