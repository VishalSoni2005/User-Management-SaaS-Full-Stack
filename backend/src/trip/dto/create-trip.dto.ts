import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateTripDto {
  @IsMongoId()
  userId: string;

  @IsNumber()
  @Min(0)
  distance: number;

  @IsNumber()
  @Min(0)
  averageSpeed: number;

  @IsNumber()
  @Min(0)
  harshBrakes: number;

  @IsNumber()
  @Min(0)
  overspeedCount: number;
}
