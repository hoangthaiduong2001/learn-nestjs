import { SetMetadata } from '@nestjs/common';
import { MY_ROLE_KEY } from 'src/constants/public.constant';

export const Roles = (...roles: string[]) => SetMetadata(MY_ROLE_KEY, roles);
