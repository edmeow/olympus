import { z } from 'zod';
import { createContestSchema } from '../zodSchemas/createContestSchema';

export type IСreateContestRequest = z.infer<typeof createContestSchema>;

export type IСreateContestRequestForm = z.mergeTypes<
    IСreateContestRequest,
    {
        participantCount: string | null;
        judgeCount: string | null;
        duration: string | null;
    }
>;
