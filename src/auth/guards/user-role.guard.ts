import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    const user = request.user as User;

    if (!user) throw new InternalServerErrorException('User not found');

    for (const userRole of user.roles) {
      if (validRoles.includes(userRole)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User '${user.fullname}' does not have a valid role: [${validRoles}]`,
    );
  }
}
