import { SetMetadata } from '@nestjs/common';
import { MY_PUBLIC_KEY } from 'src/constants/public.constant';

export const Public = () => SetMetadata(MY_PUBLIC_KEY, true);
