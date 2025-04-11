import { z } from "zod";
import { groupSchema } from "./validate";

export type Participant = z.infer<typeof groupSchema>;

export interface CreateContestDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface CreateContestFormFields {
  name: string;
  judges: string;
  prefix: string;
  duration: string;
  group: string;
  groupParticipantCount: string;
}
