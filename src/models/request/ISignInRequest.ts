import { z } from 'zod';
import { signInSchema } from '../zodSchemas/signInSchema';

export type ISignInRequest = z.infer<typeof signInSchema>;
