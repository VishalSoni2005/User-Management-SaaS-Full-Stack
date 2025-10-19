/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  private calculateSafetyScore(dto: CreateTripDto): number {
    let score = 100;
    score -= dto.harshBrakes * 5;
    score -= dto.overspeedCount * 3;

    if (dto.averageSpeed > 100) score -= 10;
    if (dto.averageSpeed < 20) score -= 5;

    return Math.max(score, 0);
  }

  private calculatePoints(score: number): number {
    if (score >= 90) return 50;
    if (score >= 80) return 30;
    if (score >= 70) return 15;
    if (score >= 60) return 5;
    return 0;
  }

  async createTrip(dto: CreateTripDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const safetyScore = this.calculateSafetyScore(dto);
    const pointsEarned = this.calculatePoints(safetyScore);

    const trip = await this.prisma.trip.create({
      data: {
        userId: dto.userId,
        distance: dto.distance,
        averageSpeed: dto.averageSpeed,
        harshBrakes: dto.harshBrakes,
        overspeedCount: dto.overspeedCount,
        safetyScore,
        pointsEarned,
      },
    });

    // updating the user total points
    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { totalPoints: { increment: pointsEarned } },
    });

    return {
      message: 'Trip recorded successfully!',
      data: { ...trip, totalPointsEarned: pointsEarned },
    };
  }

  async getTripsByUser(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return { count: trips.length, trips };
  }

  async getTripSummary(userId: string) {
    const trips = await this.prisma.trip.findMany({ where: { userId } });
    if (!trips.length) return { message: 'No trips found for this user' };

    const totalTrips = trips.length;
    const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
    const avgSafetyScore =
      trips.reduce((sum, t) => sum + t.safetyScore, 0) / totalTrips;
    const totalPointsEarned = trips.reduce((sum, t) => sum + t.pointsEarned, 0);

    return {
      userId,
      totalTrips,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      avgSafetyScore: parseFloat(avgSafetyScore.toFixed(2)),
      totalPointsEarned,
    };
  }
}
