import { z } from 'zod';
import { changeDurationSchema } from '../zodSchemas/changeDurationSchema';

export type IChangeDurationRequest = z.infer<typeof changeDurationSchema>;
