import { z } from "zod";

export const createProblemSchema = z.object({
  points: z
    .string()
    .min(1, { message: "Введите количество баллов" })
    .refine((val) => parseFloat(val) > 0, {
      message: "Количество баллов должно быть положительным числом",
    }),
  name: z.string().min(1, { message: "Название задания обязательно" }),
  pdf: z.custom((val) => val instanceof File, { message: "Загрузите задание" }),
  addition: z.custom((val) => !val || val instanceof File),
  test: z.custom((val) => !val || val instanceof File),
});
