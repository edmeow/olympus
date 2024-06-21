import { z } from 'zod';
import { addUsersSchema } from '../zodSchemas/addUsersSchema';

export type IAddUsersRequest = z.infer<typeof addUsersSchema>;
