import { z } from 'zod';

export interface IUserAnwser {
  id: number;
  userName: string;
  taskNumber: number;
  points: number | null;
  maxPoints: number;
  sentTime: string;
  fileName: string;
  filePath: string;
  viewPaths: string;
  viewEntryPoint: string | null;
  testAvailable: boolean;
}

export const UserAnswerStateTypeValues = {
  NOT_EVALUATED: 1,
  REJECTED: 2,
  ACCEPTED: 3,
} as const;

export const UserAnswerStateTypeLabels = {
  [UserAnswerStateTypeValues.NOT_EVALUATED]: 'Не оценено',
  [UserAnswerStateTypeValues.REJECTED]: 'Отклонено',
  [UserAnswerStateTypeValues.ACCEPTED]: 'Принято',
} as const;

export const UserAnswerStateTypeSchema = z.coerce
  .number()
  .pipe(z.nativeEnum(UserAnswerStateTypeValues));

export type UserAnswerStateTypeModel = z.infer<
    typeof UserAnswerStateTypeSchema
>;
