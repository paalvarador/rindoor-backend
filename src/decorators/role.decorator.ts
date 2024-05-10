import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/entities/Role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
