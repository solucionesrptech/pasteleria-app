import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRole } from '../constants/roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard que verifica que el usuario tenga uno de los roles permitidos.
 * Requiere que req.user esté definido (p. ej. por JwtAuthGuard o sesión).
 * Si no hay auth aún, no aplicarlo o hacer que permita cuando req.user falta (desarrollo).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new UnauthorizedException('No tiene permiso para esta acción');
    }
    return true;
  }
}
