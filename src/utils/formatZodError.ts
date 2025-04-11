import { ZodError } from "zod";

const formatZodError = (err?: unknown) => {
  if (err instanceof ZodError && err.issues.length > 0) {
    return { message: err.issues.map((issue) => issue.message).join("\n") };
  }
  if (err instanceof Error) {
    return err;
  }
  return { message: "Неизвестная ошибка" };
};

export default formatZodError;
