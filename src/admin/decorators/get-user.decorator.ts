import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Admin } from '../entities/admin.entity';

/**
 * Returns the current logged in user data
 */
export const GetAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Admin => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
