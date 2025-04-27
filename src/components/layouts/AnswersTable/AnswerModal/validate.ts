import { z } from "zod";

export const judgeFeedbackSchema = (maxPoints: number) =>
  z.object({
    points: z.coerce.number().lte(maxPoints, {
      message: `Оценка не должна превышать максимальное значение (${maxPoints})`,
    }),
  });
