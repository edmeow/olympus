import { z } from "zod";

export const groupSchema = z.object({
  group: z.string().min(1, { message: "Выберите группу" }),
  count: z
    .string()
    .min(1, { message: "Количество участников обязательно" })
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, {
      message: "Количество участников должно быть положительным числом",
    }),
});

export const createContestSchema = z.object({
  name: z.string().min(1, { message: "Название олимпиады обязательно" }),
  judges: z
    .string()
    .min(1, { message: "Количество жюри обязательно" })
    .refine((val) => parseInt(val) > 0, {
      message: "Количество жюри должно быть положительным числом",
    }),
  prefix: z.string().min(1, { message: "Префикс олимпиады обязателен" }),
  duration: z.string().regex(/^\d{2}:\d{2}$/, {
    message: "Формат длительности должен быть ЧЧ:ММ",
  }),
});
