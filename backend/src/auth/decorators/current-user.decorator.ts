import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthPrincipal } from '../jwt-payload.interface.js';

/** Injecte le contenu du JWT validé dans un paramètre de contrôleur. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPrincipal =>
    context.switchToHttp().getRequest<{ user: AuthPrincipal }>().user,
);
