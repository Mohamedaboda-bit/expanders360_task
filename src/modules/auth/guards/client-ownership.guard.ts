import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ClientOwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user, params } = context.switchToHttp().getRequest();
    
    if (user.role === 'admin') {
      return true;
    }

    if (user.role === 'client') {
      const resourceId = parseInt(params.id);
      if (user.clientId == resourceId) {
        return true;
      }
    }

    throw new ForbiddenException('Access denied: You can only access your own data');
  }
}
