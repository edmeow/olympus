import { z } from 'zod';

export const selectedStateSchema = z.union([
    z.literal('tasks'),
    z.literal('results'),
]);
