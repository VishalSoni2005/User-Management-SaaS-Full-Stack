import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log('🟣 user from RolesGuard:', user);

    if (!user) return false;
    if (!requiredRoles.includes(user.role)) {
      // console.log(`❌ Unauthorized: ${user.role} is not  ${requiredRoles}`);
      console.log(`Unauthorized role -> ${requiredRoles} is required`);

      return false;
    }
    return true;
  }
}
