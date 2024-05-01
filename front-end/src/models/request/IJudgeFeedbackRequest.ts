import { z } from 'zod';
import { judgeFeedbackSchema } from '../zodSchemas/judgeFeedbackSchema';

export type IJudgeFeedbackRequest = z.infer<typeof judgeFeedbackSchema>;
