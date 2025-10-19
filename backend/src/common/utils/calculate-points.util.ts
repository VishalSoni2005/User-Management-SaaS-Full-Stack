import type { CreateTripDto } from 'src/trip/dto/create-trip.dto';

export function calculateSafetyScore(dto: CreateTripDto): number {
  let score = 100;
  score -= dto.harshBrakes * 5;
  score -= dto.overspeedCount * 3;

  if (dto.averageSpeed > 100) score -= 10;
  if (dto.averageSpeed < 20) score -= 5;

  return Math.max(score, 0);
}

export function calculatePoints(score: number): number {
  if (score >= 90) return 50;
  if (score >= 80) return 30;
  if (score >= 70) return 15;
  if (score >= 60) return 5;
  return 0;
}
