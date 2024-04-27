import { z } from 'zod';
import { createContestSchema } from '../zodSchemas/createContestSchema';

export type IСreateContestRequest = z.infer<typeof createContestSchema>;
