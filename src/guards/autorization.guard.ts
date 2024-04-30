import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ROLES_KEY,
  Role,
} from '../decorators/autorization.decorator';

@Injectable()
export class AutorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      // context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user.capabilities) {
      throw new HttpException('empty capabilities', HttpStatus.UNAUTHORIZED);
    }
    let autorization = false;
    requiredRoles.some((role) => {
      for (const cap of user.capabilities) {
        if (cap.value == role) {
          autorization = true;
          break;
        }
      }
    });
    return autorization;
  }
}
